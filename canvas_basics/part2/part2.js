let ctx;
let cw;
let ch;
const n = 100;

let x = [];
let y = [];
let diam = [];
let r = [];
let dx = [];
let dy = [];
let fs = [];

let col= [];

function setup() {
    frameRate(100);
    cw = windowWidth;
    ch = windowHeight;
    createCanvas(cw, ch);
    for (let i = 0; i<n; ++i){
        diam[i] = random(20,75);
        r[i] = diam[i] / 2;
        x[i] = random(r[i], cw-r[i]);
        y[i] = random(r[i], ch-r[i]);
        dy[i] = random(1,4);
        dx[i] = random(1,4);
        let red = random(256);
        let green = random(256);
        let blue = random(256);
    
        col[i] = color(red, green, blue);
        if(Math.random()< 0.5){
            dx[i] *= -1;
        }
        if(Math.random()< 0.5){
            dy[i] *= -1;
        }
    }
    stroke(255);
    strokeWeight(5);
}

function draw() {
    background(0,0,0);
    for (let i = 0; i<n; ++i){
        
        fill(col[i]);
        ellipse(x[i],y[i],diam[i], diam[i]);
        

        // constrain coordinates of  circle
        if (x[i] < r[i]) {
            dx[i] = dx[i] *-1;
            diam[i]+= 5;
            r[i] = diam[i]*0.5;
            x[i] = r[i];
        }
        if (x[i] > cw - r[i]) {
            dx[i] = dx[i] *-1;
            diam[i]+= 5;
            r[i] = diam[i]*0.5;
            x[i] = cw - r[i];
        }

        if (y[i] < r[i]) {
            dy[i] = dy[i] *-1;
            diam[i]+= 5;
            r[i] = diam[i]*0.5;
            y[i] = r[i];
        }

        if (y[i] > ch - r[i]) {
            dy[i] = dy[i] *-1;
            diam[i]+= 5;
            r[i] = diam[i]*0.5;
            y[i] = ch - r[i];
        }

        // move the circle
        x[i] += dx[i];
        y[i] += dy[i];
    }   
}