let osc;
let pane;
let waveOptions = {
  type: 'sine',
  volume: 0.5,
  minFreq: 100,
  maxFreq: 1000
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  userStartAudio();

  // Oscillator s
  osc = new p5.Oscillator(waveOptions.type);
  osc.start();
  osc.amp(0); // Start silent

  // Tweakpane
  pane = new Tweakpane.Pane();
  pane.addInput(waveOptions, 'type', {
    options: {
      Sine: 'sine',
      Triangle: 'triangle',
      Square: 'square',
      Sawtooth: 'sawtooth'
    }
  }).on('change', (ev) => {
    osc.setType(ev.value);
  });

  pane.addInput(waveOptions, 'volume', { min: 0, max: 1 });
  pane.addInput(waveOptions, 'minFreq', { min: 20, max: 500 });
  pane.addInput(waveOptions, 'maxFreq', { min: 500, max: 2000 });
}

function draw() {
    background(10);
    fill(255);
    textSize(16);
    textAlign(CENTER, CENTER);
    text("Move mouse: X = Pitch, Y = Volume", width / 2, height / 2);
  
    // mouse position to sound p
    let freq = map(mouseX, 0, width, waveOptions.minFreq, waveOptions.maxFreq);
    let amp = map(mouseY, height, 0, 0, waveOptions.volume);
  
    // frequency and amplitude
    osc.freq(freq);
    osc.amp(amp, 0.1);
  
    // Visual
    stroke(255, 100);
    line(mouseX, 0, mouseX, height);
    line(0, mouseY, width, mouseY);
  
    // circle size
    let diameter = map(freq, waveOptions.minFreq, waveOptions.maxFreq, 50, 300);
    noStroke();
    fill(100, 200, 255, 150);
    ellipse(width / 2, height / 2, diameter);
  }
  

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
