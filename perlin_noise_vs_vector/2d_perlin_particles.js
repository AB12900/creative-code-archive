let position = 0;
let xpos = 0;
let ypos = 0;
let particles = [];
let num = 500;
const dist = 5.5;
const loopLength = 20;
let speed = 0.0022;
let speed_x = 0.01;
let speed_y = 0.02;
let slider;
let num_particles;

function setup() {
  createCanvas(windowWidth, windowHeight * 0.8);
  slider = createSlider(0, 100, 50);
  num_particles = createInput(200, "number");
  // slider.position(10, 10);
  textSize(32);
  angleMode(DEGREES);
  colorMode(HSB, 360, 100, 100, 255);
  noiseSeed(1);
  createParticles();
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
  let opacity = slider.value();
  if (num_particles.value() > num) {
    num = num_particles.value();
    createParticles();
  } else {
    num = num_particles.value();
  }

  background(0, opacity);
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
    // let p = position;
    this.coords.x = (0.5 - noise(this.offset.x + xpos)) * width;
    this.coords.y = (0.5 - noise(this.offset.y + ypos)) * height;

    fill(map(noise(position + this.offset.x, position - this.offset.y), 0, 1, 360, 0), 100, 100);
    // fill(map(this.coords.y,0,height,0,360),100,100);
  }
}
