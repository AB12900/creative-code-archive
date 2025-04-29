let cw;
let ch;
let n = 1; 

let x = [];
let y = [];
let diam = [];
let r = [];
let dx = [];
let dy = [];
let col = [];
let sizeChange = [];

let bgCol = [0, 0, 0]; // Background color 


function setup() {
    frameRate(60);
    cw = windowWidth;
    ch = windowHeight;
    createCanvas(cw, ch);

    for (let i = 0; i < n; ++i) {
        initializeCircle(i);
    }
}

function draw() {
    background(0, 20);

    bgCol[0] += 0.5; 
    bgCol[1] += 0.3; 
    bgCol[2] += 0.7; 

    if (bgCol[0] >= 256) {
        bgCol[0] = 0;
    }
    if (bgCol[1] >= 256) {
        bgCol[1] = 0;
    }
    if (bgCol[2] >= 256) {
        bgCol[2] = 0;
    }

    background(bgCol[0], bgCol[1], bgCol[2]);

    fill(255); 
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Click to add circles", cw / 2, ch / 2);


    for (let i = 0; i < n; ++i) {
        fill(col[i]);
        ellipse(x[i], y[i], diam[i], diam[i]);

        // Move circles
        x[i] += dx[i];
        y[i] += dy[i];

        // Bounce without sticking
        if (x[i] - r[i] <= 0 || x[i] + r[i] >= cw) {
            dx[i] *= -1;
        }
        if (y[i] - r[i] <= 0 || y[i] + r[i] >= ch) {
            dy[i] *= -1;
        }

        // Gradually change color
        let newRed = red(col[i]) + 1;
        let newGreen = green(col[i]) + 2;
        let newBlue = blue(col[i]) + 3;

        if (newRed >= 256) {
            newRed = 0;
        }
        if (newGreen >= 256) {
            newGreen = 0;
        }
        if (newBlue >= 256) {
            newBlue = 0;
        }

        col[i] = color(newRed, newGreen, newBlue);

        // size effect
        diam[i] += sizeChange[i];
        if (diam[i] >= 75 || diam[i] <= 20) {
            sizeChange[i] *= -1; // Reverse growth direction
        }

        r[i] = diam[i] / 2; // Update radius
    }
}

// initialize circles
function initializeCircle(i) {
    diam[i] = random(20, 75);
    r[i] = diam[i] / 2;
    x[i] = random(r[i], cw - r[i]);
    y[i] = random(r[i], ch - r[i]);

    dx[i] = random(1, 4);
    dy[i] = random(1, 4);

    if (random(1) < 0.5) {
        dx[i] = -dx[i];
    }
    if (random(1) < 0.5) {
        dy[i] = -dy[i];
    }

    col[i] = color(random(256), random(256), random(256));

    sizeChange[i] = random(0.1, 0.5);
}

function mousePressed() {
    if (n < 500) { 
        initializeCircle(n);
        n++;
    }
}
