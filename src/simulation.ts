import { Canvas} from "./canvas";
import { clamp } from "./utils/math";

interface SimulationSettings {
  fixedTimeStep: number;
  maxStepsPerFrame: number;
  playBackSpeed: number;
  height: number,
  width: number;
  units: Units;
}

interface SimulationState {
 timeBank: number;
 paused: boolean;
}

export type Units = "meters" | "pixels";

export abstract class Simulation {

  private state: SimulationState;
  private settings: SimulationSettings;

  constructor() {

    this.settings = {
      fixedTimeStep: 1/120,
      maxStepsPerFrame: 5,
      playBackSpeed: 1,
      height: 9,
      width: 16,
      units: "pixels"
    } as SimulationSettings;
    this.state = {
      timeBank: 0,
      paused: false,
    } as SimulationState;
  }

  /**
   * Starts the simulation loop. Does nothing if it is already running.
   */
  public start(): void {
    this.state.paused = false;
  }

  /**
   * Stops the rendering loop of the simulation after the last frame.
   */
  public stop() {
    this.state.paused = true;
  }

  public togglePause() {
    this.state.paused = !this.state.paused;
  }

  public isPaused(): boolean {
    return this.state.paused ?? false;
  }

  public nextStep():void {
    this.addPhysicsTime(this.settings.fixedTimeStep);
  }

  private addPhysicsTime(time: number): void  {
    this.state.timeBank += time * this.settings.playBackSpeed;
  }


  /**
   * Advances the simulation by the real time that has passed since the last frame
   * @param deltaTime The time passed since the previous frame.
   */
  public nextFrame(deltaTime: number) {
      deltaTime = clamp(deltaTime, 0, .1);

    if (!this.isPaused()) {
      this.addPhysicsTime(deltaTime);
    }



    let updates = 0;
    while(this.state.timeBank >= this.settings.fixedTimeStep && this.settings.maxStepsPerFrame > updates) {
      this.state.timeBank -= this.settings.fixedTimeStep

      this.update(this.settings.fixedTimeStep)
      updates++;
    }
  }

  public setPlaybackSpeed(speed: number): void {
    this.settings.playBackSpeed = Math.min(2, Math.max(0.1, speed))
  }

  public getPlaybackSpeed(): number {
    return this.settings.playBackSpeed;
  }


  public getWorldSize(): { height: number, width: number } {
    return {
      height: this.settings.height,
      width: this.settings.width
    }
  }


  public setWorldSize(width: number, height: number) : void {
    this.settings.width = width;
    this.settings.height = height;
  }

  public setUnits(unit: Units): void {
    this.settings.units = unit;
  }

  public getUnits(): Units {
    return this.settings.units;
  }

  /**
   * Advances the simulation by one fixed step.
   * @param deltaTime Step size in seconds.
   */
  public abstract update(deltaTime: number): void;

  /**
   * Draws the current state of the simulation. This function must not update any other values.
   * @param canvas The canvas this simulation is running in.
   */
  public abstract draw(canvas: Canvas): void;

  /**
   * Initialise the canvas or the scene
   * @param canvas
   */
  public init(canvas: Canvas): void {}

  /**
   * Returns all keyboard shortcuts implemented for this simulation.
   * @returns A record of all implemented keyboard shortcuts.
   */
  public getKeyboardShortCuts(): Record<string, () => void> {
    return {}
  }

}

export class SimulationView {
  private startedLoop: boolean = false;
  private showDebug: boolean = true;

  private averageFps: number = 0;
  private lastFpsUpdateMs: number = 0;
  private frameCount: number = 0;
  private lastFrameTimeMs: number = 0;

  private pixelsPerMeter: number = 0;
  private offsetX: number = 0;
  private offsetY: number = 0;


  constructor(private readonly canvas: Canvas, private readonly simulation: Simulation) {}

  /**
   * Starts the rendering loop. Does nothing if it is already running.
   */
  public start(): void {
      if (this.startedLoop) return;
      this.startedLoop = true;

      const now = performance.now();
      this.lastFrameTimeMs = now;
      this.lastFpsUpdateMs = now;
      this.frameCount = 0;

      this.canvas.clear();
      this.simulation.init(this.canvas);
      requestAnimationFrame((timeMs: number) => this.renderFrame(timeMs));
    }

  /**
   * Stops the rendering loop  after the last frame.
   */
  public stop() {
    if (!this.startedLoop) {
      return;
    }
    this.startedLoop = false;
    this.canvas.clear()
  }

  /**
   * Runs a new frame in the loop, advances the physics step when enough frames have past.
   *
   * @param timeMs Timestamp from requestAnimationFrame, in ms since page load.
   */
  private renderFrame(timeMs: number): void {
    if (!this.hasStarted()) {
      return;
    }




    this.canvas.clear();
    this.updateWorldSize();

    const context = this.canvas.getContext()!;
    const world = this.simulation.getWorldSize();
    context.fillStyle = "#21222C";
    context.fillRect(0, 0, world.width, world.height);

    this.simulation.nextFrame((timeMs - this.lastFrameTimeMs) / 1000);




       context.save();

      context.translate(this.offsetX, this.offsetY);
      context.scale(this.pixelsPerMeter, this.pixelsPerMeter)

    this.simulation.draw(this.canvas);
    context.restore()


    if(this.showDebug)
      this.drawDebugView();

    this.frameCount++;
    this.lastFrameTimeMs = timeMs;
    this.updateFps(timeMs);

     if (this.hasStarted())
       requestAnimationFrame((timeMs: number) => this.renderFrame(timeMs));
  };

  private drawDebugView() {
     this.canvas.drawText(`Paused: ${this.simulation.isPaused()}, FPS: ${this.getFps().toFixed(0)}, Playback Speed: ${this.simulation.getPlaybackSpeed()}`, 10, 20);
  }

  public toggleDebugView() {
    this.showDebug = !this.showDebug;
  }

  private updateWorldSize() {
    const sBounds = this.simulation.getWorldSize();
    const cWidth = this.canvas.getWidth();
    const cHeight = this.canvas.getHeight();

    this.pixelsPerMeter = Math.min(cWidth / sBounds.width, cHeight / sBounds.height);
    this.offsetX = (cWidth - sBounds.width * this.pixelsPerMeter) / 2;
    this.offsetY = (cHeight - sBounds.height * this.pixelsPerMeter) / 2
  }

  /**
   * Updates the avarage fps every second
   */
  private updateFps(timeMs: number): void {
      const elapsedMs = timeMs - this.lastFpsUpdateMs;
      if (elapsedMs < 100) return;

      this.averageFps = this.frameCount / (elapsedMs / 1000);
      this.frameCount = 0;
      this.lastFpsUpdateMs = timeMs;
    }

  public getFps(): number {
    return this.averageFps;
  }

  public hasStarted(): boolean {
    return this.startedLoop;
  }


}

export class CanvasController {

  private readonly shortcuts: Record<string, () => void>;

  constructor(shortcuts: Record<string, () => void>) {
    this.shortcuts = shortcuts;
  }

  public attach(canvas: Canvas): void {
      canvas.element.tabIndex = 0;           // makes the canvas focusable
      canvas.element.addEventListener("keydown", this.onKeyDown);
    }

    public detach(canvas: Canvas): void {
      canvas.element.removeEventListener("keydown", this.onKeyDown);
    }

    private onKeyDown = (e: KeyboardEvent): void => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const action = this.shortcuts[e.key.toLowerCase()];
      if (action) {
        e.preventDefault();
        action();
      }
    };
}
