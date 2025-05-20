// === Global State Variables ===
let mode = "menu"; // "menu", "flow", "liquid", "sand", "wave"
let particles = [], zoff = 0;
let colorPal = [], notes = {}, keyMap = {};
let drips = [];
let grid, cols, rows, w = 3;
let sandColors = [];
let stars = [];
let shootingStar = null;
let shootingTimer = 0;
let waveformRipples = [];
let waveScroll = 0;
let waveOffset = 1.0;
let targetOffset = 0;
let currentHue = 30;
let targetHue = 30;
let yPos = 0.0; // for wave noise animation
let tidePulses = [];
let pane;
let paneVisible = false;
let fullRecording;
let amplitude;
let level = 0;
let musicFiles = {
    "Clair de Lune": "Asset/claire_de_lune.mp3",
    "Gymnopedie": "Asset/Gymnopedie.mp3",
    "idea10": "Asset/idea10.mp3",
    "Prelude": "Asset/Prelude.mp3",
    "schubert": "Asset/schubert.mp3",
    "Solas Interstellar": "Asset/Solas_Interstellar.mp3",
    "Congratulations": "Asset/congratulations.mp3"
};



let params = {
    flowSpeed: 1.2,
    waveHeight: 100,
    sandAmount: 50,
    musicControl: 'Play',
    musicVolume: 0.5,
    selectedTrack: "Clair de Lune"
};


const cloudPixelScale = 6;
const cloudCutOff = 0.5;
const panSpeed = 8;
const cloudEvolutionSpeed = 4;

// === Class Definitions ===
class FlowBall {
    constructor(burst = false) {
        this.pos = createVector(random(width), random(height));
        this.vel = p5.Vector.random2D().mult(0.4);
        this.acc = createVector(0, 0);
        this.maxSpeed = burst ? 3 : 1.2;
        this.col = random(colorPal);
        this.size = random(2, 6);
    }
    follow() {
        let angle = noise(this.pos.x * 0.001, this.pos.y * 0.001, zoff) * TWO_PI * 4;
        let force = p5.Vector.fromAngle(angle).mult(0.2);
        this.acc.add(force);
    }
    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0);

        if (this.pos.x < 0) this.pos.x = width;
        if (this.pos.x > width) this.pos.x = 0;
        if (this.pos.y < 0) this.pos.y = height;
        if (this.pos.y > height) this.pos.y = 0;
    }
    show() {
        noStroke();
        fill(this.col);
        ellipse(this.pos.x, this.pos.y, this.size, this.size * 0.6);
    }
}

// === Utility Functions ===
function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < cols; i++) {
        arr[i] = new Array(rows).fill(0);
    }
    return arr;
}

function setupFlowField() {
    particles = [];
    zoff = 0;
    for (let i = 0; i < 1200; i++) {
        particles.push(new FlowBall());
    }
}

function setupColorPalette() {
    colorPal = [
        color(100, 80, 60),
        color(95, 70, 70),
        color(110, 90, 50),
        color(105, 60, 65),
        color(100, 50, 80)
    ];
}

// === p5.js Lifecycle ===
function preload() {
    keyMap = {
        'A': 'C4', 'W': 'Db4', 'S': 'D4', 'E': 'Eb4', 'D': 'E4',
        'F': 'F4', 'R': 'Gb4', 'G': 'G4', 'T': 'Ab4', 'H': 'A4',
        'Y': 'Bb4', 'J': 'B4', 'K': 'C5', 'U': 'Db5', 'L': 'D5',
        'I': 'Eb5', ';': 'E5', 'O': 'Gb5', "'": 'F5', 'P': 'Ab5'
    };

    // ✅ Load all piano key sounds
    for (let key in keyMap) {
        const noteName = keyMap[key];
        notes[noteName] = loadSound(`Asset/${noteName}.mp3`,
            () => console.log(`Loaded ${noteName}`),
            () => console.warn(`Failed to load ${noteName}`)
        );
    }

    // ✅ Load full music tracks
    for (let name in musicFiles) {
        const path = musicFiles[name];
        musicFiles[name] = loadSound(path,
            () => console.log(`Loaded track: ${name}`),
            () => console.warn(`Failed to load track: ${name}`)
        );
    }

    // ✅ Set default track
    fullRecording = musicFiles[params.selectedTrack];
}


function setup() {
    createCanvas(windowWidth, windowHeight);
    setupTweakpane();
    noStroke();
    colorMode(HSB, 360, 100, 100, 100);
    textAlign(CENTER, CENTER);
    setupFlowField();
    setupColorPalette();
    cols = floor(width / w);
    rows = floor(height / w);
    grid = make2DArray(cols, rows);
    sandColors = [color(40, 30, 90), color(35, 40, 95), color(30, 20, 80)];
    amplitude = new p5.Amplitude();
    amplitude.setInput(fullRecording);
    // Don't autoplay — let Tweakpane handle it
    fullRecording.setVolume(params.musicVolume);

    
    for (let i = 0; i < 200; i++) {
        stars.push({
            x: random(width),
            y: random(height),
            size: random(1, 2.5),
            baseAlpha: random(30, 70),
            twinkleSpeed: random(0.01, 0.05),
            offset: random(TWO_PI)
        });
    }

    background(0);

}

function setupTweakpane() {
    pane = new Tweakpane.Pane();
    pane.hidden = true;

    pane.addInput(params, 'flowSpeed', { min: 0.5, max: 5, label: 'Flow Speed' });
    pane.addInput(params, 'waveHeight', { min: 50, max: 300, label: 'Wave Height' });

    // Music selection dropdown
    pane.addInput(params, 'selectedTrack', {
        label: 'Music Track',
        options: {
            "Clair de Lune": "Clair de Lune",
            "Gymnopedie": "Gymnopedie",
            "idea10": "idea10",
            "Prelude": "Prelude",
            "schubert": "schubert",
            "Solas Interstellar": "Solas Interstellar",
            "Congratulations": "Congratulations"
        }
    }).on('change', () => {
        if (fullRecording && fullRecording.isPlaying()) {
            fullRecording.stop();
        }
        fullRecording = musicFiles[params.selectedTrack];
        fullRecording.setVolume(params.musicVolume);
    
        // ✅ Reconnect amplitude to the new track
        amplitude.setInput(fullRecording);
    });
    
    

    // 🎵 Play / Pause / Restart controls
    pane.addInput(params, 'musicControl', {
        options: { Play: 'Play', Pause: 'Pause', Restart: 'Restart' },
        label: 'Control'
    }).on('change', (ev) => {
        if (ev.value === 'Play') {
            if (!fullRecording.isPlaying()) fullRecording.play();
        } else if (ev.value === 'Pause') {
            fullRecording.pause();
        } else if (ev.value === 'Restart') {
            if (fullRecording.isPlaying()) fullRecording.stop();
            fullRecording.play(0, 1, params.musicVolume);
        }
    });

    pane.addInput(params, 'musicVolume', {
        min: 0, max: 1, step: 0.01, label: 'Volume'
    }).on('change', (ev) => {
        fullRecording.setVolume(ev.value);
    });
}




function draw() {
    level = amplitude.getLevel();
    if (mode === "menu") drawMenu();
    else if (mode === "flow") drawFlowField();
    else if (mode === "liquid") drawLiquidDrip();
    else if (mode === "sand") drawSand();
    else if (mode === "wave") drawWaveformTerrain();
}

// === Draw Functions for Modes ===
function drawMenu() {
    background(0);
    textStyle(NORMAL);
    fill(255);
    textSize(50);
    text("\u{1F3A8} Visual Piano Playground", width / 2, height / 3 - 40);

    textSize(24);
    fill(180);
    text("Press a number to choose a visual mode", width / 2, height / 3 + 10);
    text("A-L, W-P: Play notes | V: Toggle menu | ESC: Exit mode", width / 2, height / 3 + 40);

    textSize(30);
    fill(255);
    let baseY = height / 2;
    text("1 - Flow Field", width / 2, baseY);
    text("2 - Liquid Drip", width / 2, baseY + 50);
    text("3 - Harmonic Sands", width / 2, baseY + 100);
    text("4 - Waveform Terrain", width / 2, baseY + 150);

    textSize(16);
    fill(150);
    text("ESC: Return to menu   |   Return: Restart visual", width / 2, height - 40);
}

function drawFlowField() {
    fill(0, 0, 0, 10);
    rect(0, 0, width, height);

    for (let p of particles) {
        p.maxSpeed = params.flowSpeed;
        p.follow();
        p.update();
        p.show();
    }

    // === NEW: Detect spike from Clair de Lune ===
    if (fullRecording.isPlaying()) {
        let threshold = 0.02; // adjust sensitivity
        if (level > threshold && frameCount % 5 === 0) {
            // Simulate a key press burst
            for (let i = 0; i < 40; i++) {
                particles.push(new FlowBall(true));
            }
        }
    }

    zoff += 0.002;
}


function drawLiquidDrip() {
    setGradientBackgroundSkyCycle();
    noStroke();
    let centerX = width / 2;
    let centerY = height / 3;
    let radius = 200;
    let detail = 100;
    let dripLength = map(waveOffset, 0, 3, 130, 250);
    let c1 = color('#ffb347');
    let c2 = color('#ff6a00');

    beginShape();
    for (let i = 0; i <= detail; i++) {
        let angle = PI + (i / detail) * PI;
        let x = centerX + cos(angle) * radius;
        let y = centerY + sin(angle) * radius;
        let n = noise(i * 0.15, waveOffset);
        let drop = map(n, 0, 1, 30, dripLength);
        let finalY = y + drop;
        let inter = map(i, 0, detail, 0, 1);
        let col = lerpColor(c1, c2, inter);
        fill(col);
        vertex(x, finalY);
    }
    for (let i = detail; i >= 0; i--) {
        let angle = PI + (i / detail) * PI;
        let x = centerX + cos(angle) * radius;
        let y = centerY + sin(angle) * radius;
        vertex(x, y);
    }
    endShape(CLOSE);

    if (fullRecording.isPlaying()) {
    let threshold = 0.02; // More sensitive for quiet parts
    if (level > threshold && frameCount % 10 === 0) {
        targetOffset += 0.6;
        targetHue = (targetHue + 60) % 360;
    }
}

    
    waveOffset += (targetOffset - waveOffset) * 0.1;
    targetOffset *= 0.96;
}

function drawSand() {
    background(0, 0, 15);
    drawStars();
    drawSandHills();

    if (!shootingStar && random(1) < 0.00125) {
        shootingStar = {
            pos: createVector(-50, random(0, height * 0.2)),
            trail: [],
            vel: createVector(3, 0.8),
            life: 100
        };
    }

    if (shootingStar) {
        shootingStar.trail.push(shootingStar.pos.copy());
        if (shootingStar.trail.length > 30) shootingStar.trail.shift();

        shootingStar.pos.add(shootingStar.vel);
        shootingStar.life -= 0.3;

        push();
        noFill();
        strokeWeight(2);
        for (let i = 1; i < shootingStar.trail.length; i++) {
            let alpha = map(i, 1, shootingStar.trail.length, 0, shootingStar.life);
            stroke(0, 0, 100, max(0, alpha));
            line(shootingStar.trail[i - 1].x, shootingStar.trail[i - 1].y,
                shootingStar.trail[i].x, shootingStar.trail[i].y);
        }
        pop();

        if (
            shootingStar.pos.x > width + 50 ||
            shootingStar.pos.y > height * 0.6 ||
            shootingStar.life <= 0
        ) {
            shootingStar = null;
        }
    }

    for (let y = rows - 2; y >= 0; y--) {
        for (let x = 1; x < cols - 1; x++) {
            if (grid[x][y] && !grid[x][y + 1]) {
                grid[x][y + 1] = grid[x][y];
                grid[x][y] = 0;
            } else if (grid[x][y] && !grid[x - 1][y + 1]) {
                grid[x - 1][y + 1] = grid[x][y];
                grid[x][y] = 0;
            } else if (grid[x][y] && !grid[x + 1][y + 1]) {
                grid[x + 1][y + 1] = grid[x][y];
                grid[x][y] = 0;
            }
        }
    }

    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            if (grid[x][y]) {
                fill(grid[x][y]);
                if (random() < 0.98) rect(x * w, y * w, w, w);
            }
        }
    }

    // === Music-driven sand drops ===
    if (fullRecording.isPlaying()) {
    let threshold = 0.015;
        if (level > threshold && frameCount % 7 === 0) {
            // Pick a random note name (optional for variation)
            let sampleNotes = ['C4', 'D4', 'E4', 'G4', 'A4'];
            let note = random(sampleNotes);
        triggerSand(note, true);
        }
    }

  }


  function drawWaveformTerrain() {
    background(210, 80, 90); // sky blue
    let rows = 6; // number of wave layers
    let waveMaxHeight = params.waveHeight;;
    let baseY = height * 0.75;
    let baseT = frameCount * 0.005;

    for (let i = rows; i >= 0; i--) {
        let t = baseT + i * 5;
        let yOffset = i * waveMaxHeight / 3;
        let waveY = baseY - yOffset;

        push();
        colorMode(HSB);
        let hue = map(i, 0, rows, 200, 240); // ocean gradient
        fill(hue, 60, 60, 100);
        noStroke();

        beginShape();
        vertex(0, height);
        vertex(0, waveY);

        for (let x = 0; x <= width + 10; x += 10) {
            let y = waveY - map(noise(t), 0, 1, 10, waveMaxHeight);
            vertex(x, y);
            t += 0.015;
        }        

        vertex(width, waveY);
        vertex(width, height);
        endShape(CLOSE);
        pop();
    }

    // white foam ripple effects on top of waves when notes are hit
    for (let i = waveformRipples.length - 1; i >= 0; i--) {
        let r = waveformRipples[i];
        r.alpha -= 3;
        r.radius += 1.5;
        if (r.alpha <= 0) {
            waveformRipples.splice(i, 1);
        } else {
            noFill();
            stroke(0, 0, 100, r.alpha);
            strokeWeight(2);
            ellipse(r.x, height * 0.65, r.radius * 2);
        }
    }
    // === Music-triggered ripple circles ===
    if (fullRecording.isPlaying()) {
        let threshold = 0.01;
        if (level > threshold && frameCount % 8 === 0) {
            let x = random(100, width - 100);
            waveformRipples.push({
                x: x,
                radius: 10,
                alpha: 255,
            col: color(random(360), 80, 100)
            });
        }
    }

}


// === Background and Visual Helpers ===
function setGradientBackgroundSkyCycle() {
    let time = (frameCount % (60 * 30)) / (60 * 30);
    let skyTopHue = map(sin(TWO_PI * time), -1, 1, 200, 30);
    let skyBotHue = map(sin(TWO_PI * time + HALF_PI), -1, 1, 220, 50);

    let topColor = color(skyTopHue, 50, 100);
    let botColor = color(skyBotHue, 80, 100);

    for (let y = 0; y < height; y++) {
        let inter = map(y, 0, height, 0, 1);
        let col = lerpColor(topColor, botColor, inter);
        stroke(col);
        line(0, y, width, y);
    }
}

function drawStars() {
    noStroke();
    for (let s of stars) {
        let twinkle = s.baseAlpha + sin(frameCount * s.twinkleSpeed + s.offset) * 30;
        fill(60, 10, 100, constrain(twinkle, 10, 100));
        ellipse(s.x, s.y, s.size);
    }
}

function drawSandHills() {
    noStroke();
    for (let i = 0; i < 2; i++) {
        fill(color(30, 30, 40 + i * 10, 30));
        beginShape();
        for (let x = 0; x <= width; x += 10) {
            let y = height - 150 - i * 30 + sin(x * 0.015 + i * 50) * 25;
            vertex(x, y);
        }
        vertex(width, height);
        vertex(0, height);
        endShape(CLOSE);
    }

    for (let i = 0; i < 3; i++) {
        fill(color(30 - i * 5, 40, 60 - i * 10, 100));
        beginShape();
        for (let x = 0; x <= width; x += 15) {
            let y = height - 50 - i * 25 + sin(x * 0.02 + frameCount * 0.001 + i * 20) * 20;
            vertex(x, y);
        }
        vertex(width, height);
        vertex(0, height);
        endShape(CLOSE);
    }
}

// === Input ===
function keyPressed() {
    if (key === 'v') {
        paneVisible = !paneVisible;
        pane.hidden = !paneVisible;
    }
  if (mode === "menu") {
      if (key === '1') {
          mode = "flow";
          background(0);
          setupFlowField();
      } else if (key === '2') {
          mode = "liquid";
          background(255);
          drips = [];
      } else if (key === '3') {
          mode = "sand";
          grid = make2DArray(cols, rows);
      } else if (key === '4') {
          mode = "wave";
          waveformRipples = [];
          background(0);
      }
    
  } else {
      if (keyCode === ESCAPE) {
          mode = "menu";
      }
      if (keyCode === ENTER || keyCode === RETURN) {
          if (mode === "flow") {
              background(0);
              setupFlowField();
          }
          if (mode === "liquid") {
              background(255);
              drips = [];
          }
      }

      let k = key.toUpperCase();
      if (keyMap[k]) {
          if (mode === "flow" && notes[keyMap[k]]) {
              notes[keyMap[k]].play();
              for (let i = 0; i < 40; i++) {
                  particles.push(new FlowBall(true));
              }
          } else if (mode === "liquid") {
              triggerLiquidDrip(keyMap[k]);
          } else if (mode === "sand") {
              triggerSand(keyMap[k]);
          } else if (mode === "wave" && notes[keyMap[k]]) {
              notes[keyMap[k]].play();

              let x;
              if (k === ';') x = width * 0.8;
              else if (k === "'") x = width * 0.9;
              else x = map(k.charCodeAt(0), 65, 90, 100, width - 100);

              waveformRipples.push({
                  x: x,
                  radius: 10,
                  alpha: 255,
                  col: color(random(360), 80, 100)
              });
          }
      }
  }
}


// === Trigger Functions ===
function triggerLiquidDrip(noteName) {
    if (notes[noteName]) {
        notes[noteName].play();
        targetOffset += 0.6;
        targetHue = (targetHue + 60) % 360;
        drips.push({
            x: random(width * 0.4, width * 0.6),
            y: height / 3,
            speed: random(1, 3),
            color: color(targetHue, 80, 100)
        });
    }
}


function triggerSand(note, fromMusic = false) {
    if (!fromMusic && notes[note]) {
        notes[note].play();
    }

    let xPos;
    if (note.includes('C')) xPos = floor(random(cols * 0.1, cols * 0.2));
    else if (note.includes('E')) xPos = floor(random(cols * 0.45, cols * 0.55));
    else if (note.includes('G')) xPos = floor(random(cols * 0.7, cols * 0.9));
    else if (note.includes('D')) xPos = floor(random(cols * 0.3, cols * 0.4));
    else if (note.includes('F')) xPos = floor(random(cols * 0.6, cols * 0.7));
    else xPos = floor(random(cols * 0.3, cols * 0.7));

    let chosenColor = random(sandColors);
    for (let i = 0; i < params.sandAmount; i++) {
        let x = constrain(xPos + floor(random(-5, 5)), 0, cols - 1);
        let y = floor(random(3));
        grid[x][y] = chosenColor;
    }
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
