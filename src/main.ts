// Part 0 starts here. See Assigment.md for the part and its checklist.
// Engine code is yours to write: no AI autocomplete, no physics libraries.


import "./vector";
import "./vector.unit.test";

import { CanvasController, Simulation, SimulationView }from "./simulation";
import { Canvas } from "./canvas";
import { BallSimulation } from "./simulations/part3";
import { getBody } from "./utils/html";
import { capFirst } from "./utils/string";
import { PartZero } from "./simulations/part0";

function createSimulationElement(name: string): HTMLDivElement {
  const template = document.querySelector("template#simulation-template") as HTMLTemplateElement;
  const simulationNode = template.content.cloneNode(true) as DocumentFragment;
  const simulationElement = simulationNode.firstElementChild! as HTMLDivElement;

  const canvasElement = simulationElement.querySelector("canvas.simulation") as HTMLCanvasElement;
  canvasElement.id = name.replace(" ", "-");

  const titleElement = simulationElement.querySelector("h1") as HTMLHeadingElement;
  titleElement.innerText = capFirst(name);

  return simulationElement;
}

function createSimulation(name: string, simulation: Simulation): SimulationView {
  const simulationElement = createSimulationElement(name);
  const canvasElement = simulationElement.querySelector(`canvas`) as HTMLCanvasElement;

  const canvas = new Canvas(canvasElement);
  const view = new SimulationView(canvas, simulation);

  const startButton = simulationElement.querySelector("button.start") as HTMLButtonElement;
  const pauseButton = simulationElement.querySelector("button.pause") as HTMLButtonElement;
  const speedButton = simulationElement.querySelector("button.speed") as HTMLButtonElement;
  const nextFrameButton = simulationElement.querySelector("button.next-frame") as HTMLButtonElement;

  const fullScreenButton = simulationElement.querySelector("button.fullscreen") as HTMLButtonElement;


  function toggleStart() {
    if (view.hasStarted()) {
      view.stop();
      startButton.dataset.icon = "▶";
      startButton.innerText = "Start";
    } else {
      view.start();
      startButton.dataset.icon = "■";
      startButton.innerText = "Stop";
    }
    startButton.classList.toggle("running", view.hasStarted());
  }

  function togglePause() {
    simulation.togglePause();
    pauseButton.dataset.icon = simulation.isPaused() ? "▶" : "⏸";
    pauseButton.innerText = simulation.isPaused() ? "Resume" : "Pause";
  }

  function toggleSpeed() {
    simulation.setPlaybackSpeed(simulation.getPlaybackSpeed() == 1 ? 0.2 : 1);
    speedButton.innerText = `${simulation.getPlaybackSpeed()}x`
  }

  function nextFrame() {
    simulation.nextStep()
  }

  startButton.addEventListener("click", toggleStart);
  pauseButton.addEventListener("click", togglePause);
  speedButton.addEventListener("click", toggleSpeed)
  nextFrameButton.addEventListener("click", nextFrame)

  fullScreenButton.addEventListener("click", () => {
    if(document.fullscreenElement) {
      document.exitFullscreen();
      return;
    }

    simulationElement.querySelector("div.simulation-wrapper")?.requestFullscreen()
  })


  getBody()?.append(simulationElement);
  const canvasKeyboardController = new CanvasController({
      "p": togglePause,
      "d": () => view.toggleDebugView(),
      "s": toggleSpeed,
      "n": nextFrame,
      ...simulation.getKeyboardShortCuts()
  });

  canvasKeyboardController.attach(canvas)
  return view;
}

createSimulation("part 3", new BallSimulation())
createSimulation("part 1", new PartZero())
