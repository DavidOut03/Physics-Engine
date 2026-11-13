import { Vector2D } from "./vector";

const TOLERANCE = 1e-9;

function approxEqual(a: number, b: number, tolerance = TOLERANCE): boolean {
  return Math.abs(a - b) < tolerance;
}

function assert(ok: boolean, name: string, value: unknown, expected: unknown) {
  console.assert(ok, `${name} failed: expected ${expected}, got ${value}`);
}

function assertNum(name: string, got: number, expected: number) {
  assert(approxEqual(got, expected), name, got, expected);
}

function assertVec(name: string, got: Vector2D, ex: number, ey: number) {
  assert(approxEqual(got.x, ex) && approxEqual(got.y, ey), name, `(${got.x}, ${got.y})`, `(${ex}, ${ey})`);
}

const a = new Vector2D(3, 4);
const b = new Vector2D(1, 2);
const zero = new Vector2D(0, 0);

// 1. add
assertVec("add a + b", a.add(b), 4, 6);
assertVec("add with zero", a.add(zero), 3, 4);

// 2. subtract
assertVec("subtract a - b", a.subtract(b), 2, 2);
assertVec("subtract b - a", b.subtract(a), -2, -2);

// 3. scale
assertVec("scale by 2", a.scale(2), 6, 8);
assertVec("scale by -1 (turns around)", a.scale(-1), -3, -4);
assertVec("scale by 0", a.scale(0), 0, 0);

// 4. length
assertNum("length of (3, 4)", a.length(), 5);
assertNum("length of zero", zero.length(), 0);
assertNum("length of (-3, -4)", new Vector2D(-3, -4).length(), 5);

// 5. lengthSquared
assertNum("lengthSquared of (3, 4)", a.lengthSquared(), 25);
assertNum("lengthSquared of (1, 2)", b.lengthSquared(), 5);

// 6. normalize
assertVec("normalize (3, 4)", a.normalize(), 0.6, 0.8);
assertNum("normalize gives length 1", b.normalize().length(), 1);
assertVec("normalize zero gives zero (no NaN)", zero.normalize(), 0, 0);

// 7. dot product
assertNum("dot a · b", a.dotProduct(b), 11);
assertNum("dot same direction", new Vector2D(2, 0).dotProduct(new Vector2D(3, 0)), 6);
assertNum("dot right angle", new Vector2D(2, 0).dotProduct(new Vector2D(0, 3)), 0);
assertNum("dot opposite", new Vector2D(2, 0).dotProduct(new Vector2D(-3, 0)), -6);

// 8. distanceTo
assertNum("distanceTo a to b", a.distanceTo(b), Math.sqrt(8));
assertNum("distanceTo is the same both ways", b.distanceTo(a), a.distanceTo(b));
assertNum("distanceTo itself", a.distanceTo(a), 0);

// 9. fromAngle
assertVec("fromAngle 0, length 2", Vector2D.fromAngle(0, 2), 2, 0);
assertVec("fromAngle π/2 (down on canvas)", Vector2D.fromAngle(Math.PI / 2), 0, 1);
assertVec("fromAngle π, length 3", Vector2D.fromAngle(Math.PI, 3), -3, 0);

// 10. angle
assertNum("angle of (1, 0)", new Vector2D(1, 0).angle(), 0);
assertNum("angle of (0, 1)", new Vector2D(0, 1).angle(), Math.PI / 2);
assertNum("angle of (0, -1)", new Vector2D(0, -1).angle(), -Math.PI / 2);

// 9 + 10. round trip: angle(fromAngle(θ)) should give θ back
for (const angle of [-2.5, -1, -0.3, 0, 0.7, 1.5, 3]) {
  assertNum(`round trip ${angle}`, Vector2D.fromAngle(angle).angle(), angle);
}

// 11. perpendicular
assertVec("perpendicular of (3, 4)", a.perpendicular(), -4, 3);
assertNum("perpendicular is at a right angle", a.dotProduct(a.perpendicular()), 0);
assertNum("perpendicular keeps the length", a.perpendicular().length(), a.length());

// 12. immutability: a, b and zero must be unchanged after all of the above.
// Did you choose mutable vectors? Then remove these three lines.
assertVec("a unchanged", a, 3, 4);
assertVec("b unchanged", b, 1, 2);
assertVec("zero unchanged", zero, 0, 0);
