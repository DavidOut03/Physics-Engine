import { Vector2D } from "./vector";

export abstract class Body {

  constructor(
    public position: Vector2D,
    public velocity: Vector2D,
    public acceleration: Vector2D,
    public radius: number
  ) {}

  update(deltaTime: number): void {
    this.velocity = this.velocity.add(this.acceleration.scale(deltaTime));
    this.position = this.position.add(this.velocity.scale(deltaTime))
  }
}

export abstract class DynamicBody extends Body {

  private forces: Vector2D;
  private inverseMass: number;

  // forces
  private gravity: number;
  private wind: number;

  // Friction
  private linearDrag: number;
  private quadraticDrag: number;

  constructor(
    position: Vector2D,
    velocity: Vector2D,
    private mass: number,
    radius: number
  ) {
    super(position, velocity, Vector2D.zero(), radius);

    this.forces = Vector2D.zero();
    this.inverseMass = 1/mass;

    this.wind = 0;
    this.gravity = 9.81;

    this.linearDrag =  5;
    this.quadraticDrag = 0;
  }


  public setGravity(gravity: number = 9.81) {
    this.gravity = gravity;
  }

  public getGravity(): number {
    return this.gravity;
  }

  public setWind(wind: number): void {
    this.wind = wind;
  }

  public getWind(): number {
    return this.wind;
  }

  applyForce(force: Vector2D) {
    this.forces = this.forces.add(force);
  }

  private calculateAcceleration(): Vector2D {
    return this.forces.scale(this.inverseMass);
  }

  update(deltaTime: number): void {
    this.applyForce(new Vector2D(0, this.getGravity() * this.mass));
    this.applyForce(new Vector2D(this.getWind(), 0));
    this.applyForce(this.velocity.scale(-this.linearDrag))
    this.applyForce(this.velocity.scale(-this.quadraticDrag).scale(this.velocity.length()));


    this.acceleration = this.calculateAcceleration();
    super.update(deltaTime);
    this.forces = Vector2D.zero();
  }
}
