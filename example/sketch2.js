let params = {
  bgColor: { r: 0, g: 100, b: 200 },
  circleSize: 50,
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  console.log("Canvas created with size:", windowWidth, windowHeight);
  setupPane();
}

function draw() {
  console.log("Parameters:", params);
  background(params.bgColor.r, params.bgColor.g, params.bgColor.b);
  ellipse(width / 2, height / 2, params.circleSize);
}

function setupPane() {
  const pane = new Pane();

  pane.addInput(params, "bgColor", {
    picker: "inline",
    expanded: true,
  });

  pane.addInput(params, "circleSize", {
    min: 10,
    max: 300,
  });
}
