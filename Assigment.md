# Assignment
Build a 2D physics engine from scratch with TypeScript and HTML canvas, from just a dot on a screen to a full physics simulation and game.

Every part below describes what should be built.

## Index

- [Part 0: Setup and how the canvas works](#part-0-setup-and-how-the-canvas-works)
- [Part 1: Vectors](#part-1-vectors)
- [Part 2: The game loop and time](#part-2-the-game-loop-and-time)
- [Part 3: Motion](#part-3-motion)
- [Part 4: Forces and mass](#part-4-forces-and-mass)
- [Part 5: Walls and bouncing](#part-5-walls-and-bouncing)
- [Part 6: Ball to ball collisions](#part-6-ball-to-ball-collisions)
- [Part 7: Energy and integrators](#part-7-energy-and-integrators)
- [Part 8: Springs and ropes](#part-8-springs-and-ropes)
- [Part 9: The sandbox](#part-9-the-sandbox)
- [Part 10: The spring slingshot game](#part-10-the-spring-slingshot-game)
- [Part 11: Bonus challenges](#part-11-bonus-challenges)
- [Part 12: Your own simulation or game](#part-12-your-own-simulation-or-game)

## Part 0: Setup and how the canvas works

The canvas element in html is an element with a grid of pixels starting from (0,0) top left. 
Use the canvas element in the [index.html](index.html) to display a circle, a line from corner to corner and twelve dots in a ring.

**Done when**

- [x] The canvas fills the window with no scrollbars.
- [x] The circle stays in the centre when you resize the window.
- [x] The line goes exactly from corner to corner, also after resizing.
- [x] The 12 clock dots are evenly spread, and the first one is at the top.
- [x] You can explain out loud why angle π / 2 points down on the canvas.

## Part 1: Vectors

To make sure something moves we need to describe where it goes. This is done with vectors. Create a `Vector2d` class to do the calculations with vectors. Everything after this part is arrows: positions, velocities and forces.

The vector class must implement these operations:
- Adding: Add two vectors together `vector1.add(vector2)`. `(x1, y1) + (x2, y2) = (x1 + x2, y1 + y2)`
- Subtract: Subtract one vector from another `vector1.subtract(vector2)`. `(x1, y1) - (x2, y2) = (x1 - x2, y1 - y2)`
- Scaling: Increase or decrease the size of the vector by a scalar `vector.scale(SCALAR)`. `scalar * (x,y)`
- Length: Get the length of a vector `vector.length()` which is the Pytagoras `a^2 + b^2 = c^2`
- Normalize: Get a vector with the same direction but length 1 `vector.normalize()`. A vector of length 0 may not give a NaN
- Dot product: One number that says how much two vectors point the same way `vector1.dot(vector2)`. `(x1 * x2) + (y1 * y2)`
- Perpendicular: Turn the vector a quarter turn `vector.perp()`
- Angles: Get the angle of a vector `vector.angle()` and build a vector from an angle `Vector2d.fromAngle(ANGLE)`

Write tests for every operation, because every later part stands on this class.

**Done when**

- [x] Every method has at least two tests, and all tests pass without printing anything.
- [x] Normalizing (0, 0) gives no NaN.
- [x] The `fromAngle` / `angle` round trip also works for negative angles.
- [x] You can explain what a negative dot product means, without looking.
- [x] You chose immutable or mutable vectors on purpose, and can say why.

## Part 2: The game loop and time

A screen draws frames, but the time between two frames is never the same: screens have different refresh rates, tabs get hidden and the debugger stops everything. Physics that uses that raw time runs faster on a faster screen.

Split the loop in two: draw every frame, but update the physics in fixed steps of 1/120 s. Keep the time that is left over and use it in the next frame.

Add the debug controls that are used for the rest of the project:
- `P`: pause and resume
- `N`: one fixed step while paused
- `S`: slow motion
- A text overlay with the paused state, the FPS and the number of steps per frame

**Done when**

- [ ] The dot moves at the same speed with a normal and a slowed-down frame rate.
- [ ] After a pause in the debugger (or a tab switch), the dot jumps at most 10 px.
- [ ] Physics runs in fixed steps of 1/120 s, and the number of steps per frame is on screen.
- [ ] `P`, `N` and `S` all work on the dot, and the text on screen shows their state.
- [ ] You can explain the time bank, without looking.

## Part 3: Motion

A body has a position, a velocity (how much the position changes per second) and an acceleration (how much the velocity changes per second). Each step the acceleration changes the velocity, and the velocity changes the position.

Create a `Body` class with a position, velocity, acceleration and radius, all in metres. The body has no drawing code: a separate renderer reads the bodies and converts metres to pixels.

Build two scenes and one debug key:
- A ball dropped from rest, which should speed up
- A ball thrown with a start velocity, which should fly a parabola and leave a trail of its last positions
- `D`: draw the velocity of every body as an arrow

**Done when**

- [ ] `Body` has no drawing code; the renderer has no physics code.
- [ ] The thrown ball flies a smooth curve with a trail.
- [ ] The fall after 1 second is within 1% of 4.905 m (so between 4.86 and 4.95 m).
- [ ] You can say why it isn't exactly 4.905, before Part 7 tells you.
- [ ] `D` shows a velocity arrow with an arrowhead on every ball, and on the thrown ball it turns from up to down.

## Part 4: Forces and mass

Until now the acceleration was set by hand. A force is what causes acceleration, and the mass decides how much of it: `F = m * a`. Each step, add up all forces on a body, divide the total by the mass to get the acceleration, and reset the total afterwards.

Give every body a mass and add three forces:
- Gravity: pulls every body down, and is the only one that scales with mass, so everything falls at the same rate
- Wind: a constant push sideways, which moves a light body further than a heavy one
- Drag: pushes against the velocity and grows with the speed, so a falling body reaches a terminal velocity that can also be worked out on paper

**Done when**

- [ ] Three balls of different mass fall side by side, at the same height the whole way.
- [ ] With wind on, the light ball drifts further than the heavy one.
- [ ] Forces don't grow over time (the total goes back to zero every step).
- [ ] The measured terminal velocity matches your paper answer within a few percent, for both kinds of drag.

## Part 5: Walls and bouncing

Give the world four walls. A ball touches a wall when the distance from its centre to that wall is smaller than its radius. Two things then have to happen: put the ball back out of the wall, and turn around the part of the velocity that points into the wall.

Restitution `e` decides how much speed survives a bounce: `e = 1` keeps bouncing, `e = 0` sticks. Only bounce a ball that is moving into the wall, otherwise it stays stuck to it.

Add friction on the floor so a rolling ball slows down and stops, and make a ball that lies on the floor stand completely still instead of trembling.

**Done when**

- [ ] No ball ever leaves the box, also when you throw it hard into a corner.
- [ ] The measured bounce height matches your prediction within a few percent.
- [ ] A ball lying on the floor is completely still (check with the velocity arrows).
- [ ] A rolling ball slows down and stops.
- [ ] Your version of the demo works.

## Part 6: Ball to ball collisions

Balls now also hit each other. Two balls touch when the distance between their centres is smaller than the sum of their radii. Check every pair once, and skip the pairs that are already moving apart.

A collision happens in two steps: push the two balls apart so they no longer overlap, then change both velocities at once with an impulse along the line between the centres, where the heavier ball changes less.

Momentum (mass times velocity, added over all bodies) stays the same through a collision, so use it to check the result. Build a Newton's cradle and a pit of a hundred balls.

**Done when**

- [ ] The total momentum stays the same (to a few decimals) through a collision.
- [ ] Two equal balls with e = 1 in a head-on hit swap velocities.
- [ ] The cradle sends the last ball off and leaves the others almost still.
- [ ] The 100-ball pit settles without trembling, exploding or balls leaking out.
- [ ] You can explain why pairs that move apart must be skipped.

## Part 7: Energy and integrators

Add up the kinetic energy (from speed) and the potential energy (from height) of the whole scene and draw both, plus the total, in a live graph. The graph drives nothing, it only measures.

What it measures is the step rule from Part 3. Implement three of them and make them switchable while the simulation runs:
- Explicit Euler: position first, with the old velocity. Gains energy.
- Semi-implicit Euler: velocity first, then the position with the new velocity. This is the one from Part 3.
- Verlet: uses the previous position instead of a stored velocity.

Run the same scene with a large step (dt = 1/20 s) to see them drift apart.

**Done when**

- [ ] The energy graph shows kinetic, potential and total, and total is almost flat with your normal settings.
- [ ] You can switch integrators while running without the ball jumping.
- [ ] With dt = 1/20 you've seen explicit Euler gain energy.
- [ ] Bouncing still works with Verlet.
- [ ] You can answer your own Part 3 question now, and you've checked your old guess.

## Part 8: Springs and ropes

A spring connects two bodies and pulls them towards a rest length: the further away from that length, the harder it pulls (Hooke's law), scaled by the stiffness `k`. Damping takes energy out along the spring, so the bobbing stops.

Build with springs:
- A single spring between two bodies, and one between a body and a fixed anchor
- A rope: twenty bodies chained with short springs, hanging between two anchors
- A mouse spring, to drag a body around
- A breaking spring, that snaps when it is stretched too far

A stiff spring explodes at a fixed step size. Find the stiffness where that happens and use substeps (several smaller physics steps inside one step) to move that limit.

**Done when**

- [ ] The measured bob time is within a few percent of 2 × π × √(m / k).
- [ ] With damping, bobbing dies out, but a pendulum keeps swinging.
- [ ] With damping off, total energy (including springs) stays almost flat.
- [ ] You can drag a ball around with the mouse spring.
- [ ] A 20-ball rope hangs between two anchors in a smooth curve, without trembling.
- [ ] A rope snaps when you pull it too far.
- [ ] You found the stiffness where it explodes and know what moves that point.

## Part 9: The sandbox

Turn the engine into a playground. Convert the mouse position to world coordinates and add tools:
- Add, grab, throw and delete bodies, where deleting a body also removes its springs
- Draw a spring between two bodies
- A settings panel with live numbers: gravity (size and angle), restitution, stiffness, damping and the step size
- Save the scene to JSON and load it back exactly as it was, springs included

**Done when**

- [ ] The crosshair sits exactly on the mouse, also after resizing.
- [ ] You can throw a ball across the box.
- [ ] Deleting a body also removes its springs.
- [ ] Changing gravity's angle makes everything fall sideways.
- [ ] Save, reload the page, load: the scene is identical, springs included.
- [ ] You can explain why dragging by setting the position can't throw.

## Part 10: The spring slingshot game

A game built entirely on the engine. The slingshot is a spring: grab the ball, pull it back, and the energy stored in the spring becomes the launch speed when you let go.

The levels are made of the parts that already exist: ropes that snap, swings, springy platforms and targets that have to fall. The aiming dots come from simulating a copy of the world forward in time, so aiming never changes the real world.

Three levels, loaded from JSON, that can be won and lost.

**Done when**

- [ ] Pulling further makes the ball fly faster, and the launch speed is close to your energy prediction (a bit lower, never higher).
- [ ] The predicted and measured launch angle are close.
- [ ] The aiming dots match the real flight, at least until the first collision.
- [ ] Aiming doesn't change the real world (the dots come from a copy).
- [ ] A hit can snap a rope and make a target fall.
- [ ] Three levels load from JSON and can be won and lost.
- [ ] Someone else played it without you explaining the controls.

## Part 11: Bonus challenges

Optional, and every one of them stretches the engine past what it was built for. Pick one or more:
- A: A grid that splits the world into cells, so 1000+ balls stay smooth instead of checking every pair
- B: Planets that pull on each other, in orbits
- C: Two double pendulums with almost the same start, which drift apart (chaos)
- D: Ramps: walls under an angle instead of straight ones
- E: Boxes that rotate, with an angle, an angular velocity and torque

**Done when**

- [ ] A: 1000 balls run smoothly, and you measured the physics time before and after.
- [ ] B: (orbit time)² / r³ is the same, within a few percent, for three orbits.
- [ ] C: two double pendulums visibly drift apart from almost the same start.
- [ ] D: a ball rolls down a ramp and off its end correctly.
- [ ] E: boxes fall, tumble and come to rest on each other.

## Part 12: Your own simulation or game

Every part so far came with its own scene. This one does not: think up a simulation or game yourself and build it on the engine that now exists.

Write the idea down before the code, in a few lines: what it is, what the player does, what ends it, which parts of the engine it uses, and which piece does not exist yet. That last line is the real work. It belongs in the engine, while the rules about winning and losing stay in the game.

Build the smallest version that runs from start to end first, then improve it in rounds: play it, change the one thing that annoys you most, play again.

**Done when**

- [ ] The idea is written down before the code, and the finished thing still matches it.
- [ ] The missing piece lives in the engine, with its own test scene, and the engine knows nothing about winning or losing.
- [ ] It runs from start to end, and starts again, without reloading the page.
- [ ] Someone else used it without you explaining the controls.
- [ ] A minute of trying to break it leaves no NaN, no bodies outside the world and no freeze.
- [ ] You improved it in rounds, each round fixing the thing that annoyed you most.
- [ ] A screen recording of 30 seconds is saved.
