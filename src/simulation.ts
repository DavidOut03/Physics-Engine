import { Canvas} from "./canvas";

interface SimulationSettings {
  fixedTimeStep: number;
  maxStepsPerFrame: number;
  playBackSpeed: number;
}

interface SimulationState {
 timeBank: number;
 paused: boolean;
}

export abstract class Simulation {

  private state: SimulationState;
  private settings: SimulationSettings;

  constructor() {

    this.settings = {
      fixedTimeStep: 1/20,
      maxStepsPerFrame: 5,
      playBackSpeed: 1,
    } as SimulationSettings;
    this.state = {
      timeBank: 0,
      paused: true
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
    this.state.paused = false;
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
   *
   * @param ctx The canvas context where the simulation should be rendered.
   * @param deltaTimeMs The time passed since the previous frame.
   */
  public nextFrame(deltaTime: number) {
    if (!this.isPaused()) {
      this.addPhysicsTime(deltaTime);
    }

    let updates = 0;
    while(this.state.timeBank > this.settings.fixedTimeStep && this.settings.maxStepsPerFrame >= updates) {
      this.state.timeBank -= this.settings.fixedTimeStep

      this.update(this.settings.fixedTimeStep)
      updates++;
    }
  }

  public setPlaybackSpeed(speed: number): void {
    this.settings.playBackSpeed = Math.min(1, Math.max(0.1, speed))
  }

  public getPlaybackSpeed(): number {
    return this.settings.playBackSpeed;
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

}

export class SimulationView {
  private startedLoop: boolean = false;
  private showDebug: boolean = true;

  private averageFps: number = 0;
  private lastFpsUpdateMs: number = 0;
  private frameCount: number = 0;
  private lastFrameTimeMs: number = 0;
  private canvasController: CanvasController;

  constructor(private readonly canvas: Canvas, private readonly simulation: Simulation) {
    this.canvasController = new CanvasController({
      "p": () => this.simulation.togglePause(),
      "d": () => this.toggleDebugView(),
      "n": () => {
        this.simulation.nextStep()

      }
    })
  }

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

      this.canvasController.attach(this.canvas);
      requestAnimationFrame((timeMs: number) => this.renderFrame(timeMs));
    }

  /**
   * Stops the rendering loop  after the last frame.
   */
  public stop() {
    this.canvasController.detach(this.canvas);
    this.startedLoop = false;
  }

  /**
   * Runs a new frame in the loop, advances the physics step when enough frames have past.
   *
   * @param timeMs Timestamp from requestAnimationFrame, in ms since page load.
   */
  private renderFrame(timeMs: number): void {
    if(!this.startedLoop)
      return;

    this.canvas.clear();
    this.simulation.nextFrame((timeMs - this.lastFrameTimeMs) / 1000);
    this.simulation.draw(this.canvas);

    if(this.showDebug)
      this.drawDebugView();

    this.frameCount++;
    this.lastFrameTimeMs = timeMs;
    this.updateFps(timeMs);

    requestAnimationFrame((timeMs: number) => this.renderFrame(timeMs));
  };

  private drawDebugView() {
     this.canvas.drawText(`Paused: ${this.simulation.isPaused()}, FPS: ${this.getFps().toFixed(0)}, Playback Speed: ${this.simulation.getPlaybackSpeed()}`, 10, 20);
  }

  public toggleDebugView() {
    this.showDebug = !this.showDebug;
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
