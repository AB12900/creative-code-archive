const PARAMS = {
  stroke_color: "#ffffff",
  fill_color: "#000000",
  resolution: 0.001,
  noise_max: 4,
  expand: 0.1,
  size: 400,
  speed: 0.01,
  bg_color: { r: 0, g: 0, b: 0, a: 1.0 },
};

const pane = new Tweakpane.Pane();

pane.addInput(PARAMS, "stroke_color");
pane.addInput(PARAMS, "fill_color");
pane.addInput(PARAMS, "resolution", { min: 0.001, max: 0.5 });
pane.addInput(PARAMS, "noise_max", { min: 0.001, max: 8.5 });
pane.addInput(PARAMS, "expand", { min: 0.001, max: 800 });
pane.addInput(PARAMS, "size", { min: 20, max: 600 });
pane.addInput(PARAMS, "speed", { min: 0, max: 0.05 });
pane.addInput(PARAMS, "bg_color");

pane.on("change", function (ev) {
  if (ev.presetKey == "bg_color") {
    bg_color = color(ev.value.r, ev.value.g, ev.value.b, ev.value.a);
  }
  // console.log(bg_color);
});

// let stroke_color = 255;
let fill_color;
let bg_color;
// let resolution = 1;
// let noise_max = 4;
// let expand = 0.1;
// let particle_size = 400;
let aoff = 0;
let hidden = false;
let r_offset, g_offset, b_offset, size_offset, exp_offset;

function setup() {
  createCanvas(windowWidth, windowHeight);
  bg_color = color(0, 0, 0, 12);
  // colorMode(HSB);
  r_offset = random(0, 0.05);
  g_offset = random(0, 0.05);
  b_offset = random(0, 0.015);
  size_offset = random(0, 0.0025);
  exp_offset = random(0, 0.0025);
}

function draw() {
  background(bg_color);

  translate(width / 2, height / 2);
  // stroke(PARAMS.stroke_color);
  let r = map(sin(frameCount * r_offset), 0, 1, 0, 64);
  let g = map(sin(frameCount * g_offset), 0, 1, 64, 255);
  let b = map(sin(frameCount * b_offset), 0, 1, 230, 290);
  let l_size = map(sin(frameCount * size_offset), 0, 1, 20, 600);
  let l_exp = map(sin(frameCount * exp_offset), 0, 1, 0.001, 800);
  colorMode(HSB);
  stroke(b, 255, 255);
  // fill(PARAMS.fill_color);
  fill(0, 0.01);
  beginShape();
  for (let a = 0; a < TWO_PI; a += PARAMS.resolution) {
    let xoff = map(cos(a), -1, 1, 0, PARAMS.noise_max) + map(cos(aoff), -1, 1, 0, PARAMS.noise_max);
    let yoff = map(sin(a), -1, 1, 0, PARAMS.noise_max) + map(sin(aoff), -1, 1, 0, PARAMS.noise_max);
    // let r = map(noise(xoff, yoff), 0, 1, PARAMS.expand, PARAMS.size);
    let r = map(noise(xoff, yoff), 0, 1, l_exp, l_size);
    let x = r * cos(a);
    let y = r * sin(a);
    vertex(x, y);
  }
  endShape(CLOSE);
  aoff += PARAMS.speed;
}

function keyPressed() {
  if (key === "h") {
    hidden = !hidden;
    pane.hidden = hidden;
  }
}

function zeroGs(e) {
  document.getElementById(e).value = 0;
}
// Using this function is necessary to
// Skirt a bug in dat.gui handling RGB colors
function hex2rgb(hex) {
  if (hex[0] == "#") hex = hex.substr(1);
  if (hex.length == 3) {
    var temp = hex;
    hex = "";
    temp = /^([a-f0-9])([a-f0-9])([a-f0-9])$/i.exec(temp).slice(1);
    for (var i = 0; i < 3; i++) hex += temp[i] + temp[i];
  }
  var triplets = /^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(hex).slice(1);
  return {
    red: parseInt(triplets[0], 16),
    green: parseInt(triplets[1], 16),
    blue: parseInt(triplets[2], 16),
  };
}
