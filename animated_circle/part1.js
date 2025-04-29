// Get the canvas and its drawing context
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

// Set canvas size
let cw = Math.max(window.innerWidth, 500);
let ch = Math.max(window.innerHeight, 500);
canvas.width = cw;
canvas.height = ch;
const n = 50;

// Arrays to store properties
let x = [];
let y = [];
let diam = [];
let r = [];
let dx = [];
let dy = [];
let col = [];

function setup() {
    for (let i = 0; i < n; ++i) {
        diam[i] = Math.random() * (75 - 20) + 20;
        r[i] = diam[i] / 2;
        x[i] = Math.random() * (cw - 2 * r[i]) + r[i];
        y[i] = Math.random() * (ch - 2 * r[i]) + r[i];
        dx[i] = Math.random() * 3 + 1;
        dy[i] = Math.random() * 3 + 1;
        
        let red = Math.floor(Math.random() * 256);
        let green = Math.floor(Math.random() * 256);
        let blue = Math.floor(Math.random() * 256);
        col[i] = "rgb(" + red + "," + green + "," + blue + ")";


        if (Math.random() < 0.5) dx[i] *= -1;
        if (Math.random() < 0.5) dy[i] *= -1;
    }
}

function draw() {
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    for (let i = 0; i < n; ++i) {
        ctx.fillStyle = col[i];
        ctx.beginPath();
        ctx.arc(x[i], y[i], diam[i] / 2, 0, Math.PI * 2);
        ctx.fill();

        // Constrain circle coordinates
        if (x[i] < r[i]) {
            dx[i] *= -1;
            diam[i] += 5;
            r[i] = diam[i] * 0.5;
            x[i] = r[i];
        }
        if (x[i] > cw - r[i]) {
            dx[i] *= -1;
            diam[i] += 5;
            r[i] = diam[i] * 0.5;
            x[i] = cw - r[i];
        }

        if (y[i] < r[i]) {
            dy[i] *= -1;
            diam[i] += 5;
            r[i] = diam[i] * 0.5;
            y[i] = r[i];
        }

        if (y[i] > ch - r[i]) {
            dy[i] *= -1;
            diam[i] += 5;
            r[i] = diam[i] * 0.5;
            y[i] = ch - r[i];
        }

        // Move the circle
        x[i] += dx[i];
        y[i] += dy[i];
    }

    
}

// Run the program
setup();
setInterval(draw, 10);

