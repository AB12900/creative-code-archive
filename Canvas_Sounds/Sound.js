let ball;
let bounceSound, ambience;
let mode = "restart";

const PARAMS = {
  star_color: '#ffffff',
  star_speed: 5,
  star_size: 3,
  frequency: 0.02,
  max_shooting: 50,
  pause: false
};

let pane = new Tweakpane.Pane();
pane.addInput(PARAMS, 'star_color');
pane.addInput(PARAMS, 'star_speed', { min: 1, max: 20 });
pane.addInput(PARAMS, 'star_size', { min: 1, max: 10 });
pane.addInput(PARAMS, 'frequency', { min: 0.001, max: 0.2 });
pane.addInput(PARAMS, 'max_shooting', { min: 1, max: 200 });
pane.addInput(PARAMS, 'pause');

let shootingStars = [], backgroundStars = [], hidden = false;

function preload() {
  bounceSound = loadSound("coin.wav");
  ambience = loadSound("ambient_piano.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  ambience.loop();
  ball = new Ball(random(width), random(height));
  generateBackgroundStars(200);
}

function draw() {
  if (PARAMS.pause) return;

  background(0, 50);

  // background stars
  noStroke();
  fill(255);
  for (let s of backgroundStars) {
    ellipse(s.x, s.y, s.size);
  }

  // shooting stars
  if (shootingStars.length < PARAMS.max_shooting && random(1) < PARAMS.frequency) {
    let side = random() < 0.5 ? 'top' : 'left';
    shootingStars.push(new ShootingStar(side));
  }
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    shootingStars[i].update();
    shootingStars[i].show();
    if (shootingStars[i].offscreen()) {
      shootingStars.splice(i, 1);
    }
  }

  // one ball
  ball.update();
  ball.display();

  // show play mode
  fill(200);
  textSize(14);
  text(`Play Mode: ${mode} (press R to toggle)`, 10, 20);
}

function keyPressed() {
  if (key === 'h') {
    hidden = !hidden;
    pane.hidden = hidden;
  } else if (key === 'r') {
    mode = (mode === 'restart') ? 'sustain' : 'restart';
  }
}

function mousePressed() {
  userStartAudio(); 
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateBackgroundStars(200);
}

// ---- Ball ----
class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 20;
    this.dx = random([-1, 1]) * random(3, 6);
    this.dy = random([-1, 1]) * random(3, 6);
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    let bounced = false;
    if (this.x - this.r <= 0 || this.x + this.r >= width) {
      this.dx *= -1;
      bounced = true;
    }
    if (this.y - this.r <= 0 || this.y + this.r >= height) {
      this.dy *= -1;
      bounced = true;
    }

    if (bounced) this.playBounce();
  }

  playBounce() {
    bounceSound.playMode(mode);
    bounceSound.play();
  }

  display() {
    fill(255);
    noStroke();
    ellipse(this.x, this.y, this.r * 2);
  }
}

// ---- Stars ----
function generateBackgroundStars(count) {
  backgroundStars = [];
  for (let i = 0; i < count; i++) {
    backgroundStars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3)
    });
  }
}

class ShootingStar {
  constructor(side) {
    this.size = PARAMS.star_size;
    this.color = color(PARAMS.star_color);

    if (side === 'top') {
      this.x = random(width);
      this.y = random(-100, -10);
      this.vx = PARAMS.star_speed;
      this.vy = PARAMS.star_speed * 0.5;
    } else {
      this.x = random(-100, -10);
      this.y = random(height);
      this.vx = PARAMS.star_speed;
      this.vy = PARAMS.star_speed * 0.5;
    }
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  show() {
    stroke(this.color);
    strokeWeight(this.size);
    line(this.x, this.y, this.x - this.vx * 2, this.y - this.vy * 2);
  }

  offscreen() {
    return this.x > width + 50 || this.y > height + 50;
  }
}
