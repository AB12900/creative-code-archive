import { Pane } from "https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js";

window.onload = function () {
  const PARAMS = {
    factor: 123,
    title: "hello",
    color: "#ff0055",
  };

  const pane = new Pane();

  pane.addBinding(PARAMS, "factor");
  pane.addBinding(PARAMS, "title");
  pane.addBinding(PARAMS, "color");
};
