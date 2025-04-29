let position = 0;
let xpos = 0;
let ypos = 0;
let particles = [];
let num = 1000;
const dist = 5.5;
const loopLength = 20;
let speed = 0.0022;
let speed_x = 0.01;
let speed_y = 0.02;
let slider;
// let num_particles = 1000;

let gui = new dat.GUI();
let fill_color;
let opac;

let opacController, fillController;

function setup() {
  fill_color = { HSB: { h: 0, s: 0.9, v: 0.3 } };
  opac = { opacity: 45 };

  window.opacity = 100;
  window.hue = 100;
  window.num_particles = 1000;
  window.expand = 1.1647397622721547;
  window.spread = 0.16257224806192574;
  window.display_stroke = true;
  // gui.addColor(fill_color, "HSB");
  opacController = gui.add(opac, "opacity", 0, 100);
  fillController = gui.add(window, "hue", 0, 360);
  gui.addColor(fill_color, "HSB");
  gui.add(window, "expand", -2.0, 2.0);
  gui.add(window, "spread", 0.0, 5.0);
  gui.add(window, "display_stroke");
  slider = createSlider(0, 100, 50);
  // num_particles = createInput(200, "number");
  // slider.position(10, 10);
  createCanvas(windowWidth, windowHeight);
  textSize(32);
  angleMode(DEGREES);
  colorMode(HSB, 360, 100, 100, 255);
  noiseSeed(1);
  createParticles();

  opacController.onChange(myChangeFunc);
  fillController.onChange(myChangeFunc);
}

// gui.opac.onChange(function(x) {
//   console.log('onChange fired ',x);
// });

function myChangeFunc() {
  console.log("sdfg");
}

function createParticles() {
  for (let i = 0; i < num; i++) {
    let c = createVector(0, 0);
    let o = createVector(random(-dist, dist), random(-dist, dist));
    let d = map(i, 0, num, 1, 2);
    let hue = color(map(o.x, -dist, dist, 360, 180), 100, 100, 255);
    particles[i] = new Particle(c, d, o, hue);
  }
}

function draw() {
  translate(width / 2, height / 2);
  rotate(map(mouseX, 0, width, 0, 360));
  //  rotate(map(position,0,2,0,360));

  speed_x = map(mouseX, 0, width, -0.001, 0.001);
  speed_y = map(mouseY, 0, height, -0.001, 0.001);

  // form controls
  // if (window.num_particles > num) {
  //   num = window.num_particles;
  //   createParticles();
  // } else {
  //   num = window.num_particles;
  // }
  num = window.num_particles;
  if (fill_color.HSB && opac.opacity) {
    let bg = color(fill_color.HSB.h, fill_color.HSB.s * 100, fill_color.HSB.v * 100, opac.opacity);
    background(bg);
    // console.log(fill_color);
  }

  noStroke();
  for (i = 0; i < num; i++) {
    particles[i].display();
    particles[i].move();
  }
  if (position > loopLength || position < 0) {
    speed = -speed;
    speed_x = -speed_x;
    speed_y = -speed_y;
  }
  position += speed;
  xpos += speed_x;
  ypos += speed_y;

  // console.log(slider.value());
}

function mouseMoved() {}

class Particle {
  constructor(coords, diameter, offset, col) {
    this.coords = coords;
    this.diam = diameter;
    this.offset = offset;
    this.col = col;
  }
  display() {
    // fill(this.col);
    circle(this.coords.x, this.coords.y, this.diam);
  }
  move() {
    // this.coords.x = noise(position + this.offset.x, position - this.offset.y) * width;
    // this.coords.y = noise(position - this.offset.x, position + this.offset.y) * height;
    let p = position;
    this.coords.x = (0.5 - noise(this.offset.x + xpos, this.offset.y + ypos)) * width;
    this.coords.y = (0.5 - noise(this.offset.x + ypos, this.offset.y + xpos)) * height;

    fill(map(noise(position + this.offset.x, position - this.offset.y), 0, 1, window.hue, 0), 100, 100);
    // fill(map(this.coords.y,0,height,0,360),100,100);
  }
}
