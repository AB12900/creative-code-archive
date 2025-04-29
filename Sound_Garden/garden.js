let osc;
let shapes = [];
let colors = ["#ff4b5c", "#56cfe1", "#7c4dff", "#fbc531"];
let bgColor = 30;
let isPaused = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 25; i++) {
    shapes.push(new SynthShape());
  }

  osc = new p5.Oscillator('sine');
  osc.amp(0);
  osc.start();
}

function draw() {
  if (isPaused) return;

  background(bgColor);
  for (let s of shapes) {
    s.update();
    s.display();
  }
  // Help text overlay
  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  text("🎹 Press A–G for tones\n Press q / w / e to change background\n Press SPACE to pause\n Click once to unlock sound\n Move mouse near shapes to push them", 20, 20);

}

function keyPressed() {
  if (key === 'q') bgColor = color(255, 50, 50);
  if (key === 'w') bgColor = color(50, 255, 100);
  if (key === 'e') bgColor = color(50, 100, 255);
  if (key === ' ') isPaused = !isPaused;

  const notes = {
    'A': 261.90,
    'S': 293.66,
    'D': 329.63,
    'F': 349.23,
    'G': 392.00
  };

  let freq = notes[key.toUpperCase()];
  if (freq) {
    osc.freq(freq);
    osc.amp(0.5, 0.05);
    setTimeout(() => osc.amp(0, 0.2), 200);
  }
}

function mousePressed() {
  userStartAudio();
}

class SynthShape {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(30, 80);
    this.speed = random(0.5, 2);
    this.color = random(colors);
    this.angle = random(TWO_PI);
  }

  update() {
    let d = dist(this.x, this.y, mouseX, mouseY);
    if (d < 100) {
      // Repel from mouse
      let angle = atan2(this.y - mouseY, this.x - mouseX);
      this.x += cos(angle) * 2;
      this.y += sin(angle) * 2;
    } else {
      // Gentle floating motion
      this.y += sin(frameCount * 0.01 + this.x * 0.01) * this.speed;
    }
  
    if (this.y > height) this.y = 0;
    this.angle += 0.01;
  }
  

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    noStroke();
    fill(this.color);
    ellipse(0, 0, this.size);
    pop();
  }
}
