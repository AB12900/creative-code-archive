let circles = [];
const numCircles = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < numCircles; i++) {
    circles.push(new MovingCircle());
  }
}

function draw() {
  background(0);
  for (let circle of circles) {
    circle.update();
    circle.checkMouse();
    circle.checkEdges();
    circle.display();
  }
}

class MovingCircle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(random(-3, 3), random(-3, 3));
    this.radius = random(10, 30);
    this.color = color(random(255), random(255), random(255));
  }

  update() {
    this.pos.add(this.vel);
  }

  checkEdges() {
    if (this.pos.x - this.radius < 0 || this.pos.x + this.radius > width) {
      this.vel.x *= -1;
    }
    if (this.pos.y - this.radius < 0 || this.pos.y + this.radius > height) {
      this.vel.y *= -1;
    }
  }

  checkMouse() {
    let mouseVec = createVector(mouseX, mouseY);
    let d = dist(mouseX, mouseY, this.pos.x, this.pos.y);
    if (d < this.radius + 30) { // React when the mouse is close
      let escapeDir = p5.Vector.sub(this.pos, mouseVec);
      escapeDir.setMag(2);
      this.vel.add(escapeDir);
      this.vel.limit(5);
    }
  }

  display() {
    fill(this.color);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
  }
}

