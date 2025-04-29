// Simple OOP example
let sp = []; // Declare the object
let num = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < num; i++) {
    sp[i] = new Spot(i);
  }
  rectMode(CENTER);
}
function draw() {
  background(0, 6);
  for (let i = 0; i < num; i++) {
    sp[i].move();
    sp[i].constrain();
    sp[i].display();
  }
}
// function to define a class
class Spot {
  constructor(id) {
    // Construct the object
    this.id = id;
    this.chase = this.id % 2;
    this.d = random(10, 150);
    this.r = this.d * 0.5;
    this.x_start = random(this.r, width - this.r);
    this.y_start = random(this.r, height - this.r);
    this.vel = p5.Vector.mult(p5.Vector.random2D(), random(1, 7));
    // this.vel = this.vel.mult(random(0.5,15));
    // this.vel.x *= random(0.5,5);
    // this.vel.y *= random(0.5,5);
    this.pos = new p5.Vector(this.x_start, this.y_start);
    this.clr = color(random(64, 255), random(64, 255), random(64, 255));
    console.log(this.vel.x, this.vel.y);
  }
  display() {
    fill(this.clr);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(frameCount * (num * 0.5 - this.id) * 0.001);
    rect(0, 0, this.d, this.d);
    // ellipse(100, 100, this.d / 2, this.d / 2);
    pop();
  }
  move() {
    this.pos.add(this.vel);
    if (mouseIsPressed) {
      this.fleePointer();
    } else {
      this.chasePointer();
    }
  }
  fleePointer() {
    // let mouseDist = createVector(mouseX-this.pos.x, mouseY-this.pos.y);
    let mouseDist = createVector(this.pos.x - mouseX, this.pos.y - mouseY);
    if (abs(mouseDist.mag()) < width / 10) {
      this.vel.x = mouseDist.x * 0.025;
      this.vel.y = mouseDist.y * 0.025;
    }
    // console.log(mouseDist.x);
  }
  chasePointer() {
    let dx = mouseX - this.pos.x;
    this.pos.x += dx * 0.01;
    let dy = mouseY - this.pos.y;
    this.pos.y += dy * 0.01;
  }
  constrain() {
    if (this.pos.x > width - this.r || this.pos.x < this.r) {
      this.vel.x *= -1;
    }
    if (this.pos.y > height - this.r || this.pos.y < this.r) {
      this.vel.y *= -1;
    }
  }
}

// display() {
//   fill(this.clr);
//   push();
//   translate(this.pos.x, this.pos.y);
//   rotate(map(this.pos.y,0,width,-5,5));
//   rect(0, 0, this.d, this.d);
//   pop();
// }
