// Part 0 starts here. Open assignment/index.html and follow along.
// Engine code is yours to write: no AI autocomplete, no physics libraries.


import "./vector";
import "./vector.unit.test";

import { SimulationView }from "./simulation";
import { Canvas } from "./canvas";
import { BallSimulation } from "./simulations/ball";


const CANVAS_ID = "canvas";

export const canvasElement: HTMLCanvasElement = document.getElementById(CANVAS_ID) as HTMLCanvasElement;
const canvas = new Canvas(canvasElement);
const view = new SimulationView(canvas, new BallSimulation(canvas));
view.start();






// simulation.addDraw((s, _) => {

// })

// simulation.addDraw((s, timeMs) => {
//   if(s.showDebug)
//    
// })

// simulation.addUpdate((s, _) => {

// })


// simulation.start()
