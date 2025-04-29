let ctx;
const cw = 1400;
const ch = 800;
const n = 10;

let x = [];
let y = [];
let r = [];
let dx = [];
let dy = [];
let fs = [];

let img = new Image();
img.src = "chessimage.webp";

for (let i = 0; i<n; ++i){
    r[i] = Math.floor(Math.random() * 90 + 10);
    x[i] = Math.floor(Math.random() * (cw-r[i]*2))+r[i];
    y[i] = Math.floor(Math.random() * (ch-r[i]*2))+r[i];
    dy[i] = Math.floor(Math.random() * 12 + 3);
    dx[i] = Math.floor(Math.random() * 12 + 3);
    let red = Math.floor(Math.random() * 256);
    let green = Math.floor(Math.random() * 256);
    let blue = Math.floor(Math.random() * 256);

    fs[i] = "rgb(" + red+ "," + green + "," + blue + ")";
    console.log(fs[i]);
    if(Math.random()< 0.5){
        dx[i] *= -1;
    }
    if(Math.random()< 0.5){
        dy[i] *= -1;
    }
}
ctx = myCanvas.getContext("2d");

function draw() {
    ctx.drawImage(img, 0,0, cw, ch); // fill the canvas

    ctx.font = "100px Arial"; 
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Black with transparency
    ctx.fillText("Chess Animation", ch/2, cw/2);

    for (let i = 0; i<n; ++i){
        //start a crcle
        ctx.beginPath();
        ctx.moveTo(x[i], y[i] - r[i]); 
        ctx.lineTo(x[i] - r[i], y[i] + r[i]); 
        ctx.lineTo(x[i] + r[i], y[i] + r[i]); 
        ctx.closePath();

        //set color
        ctx.fillStyle = fs[i];
        ctx.fill();

        // constraints coordinates of  circle
        if (x[i] < r[i] || x[i] > cw - r[i]) {
            dx[i] = dx[i] *-1;
        }
        if (y[i] < r[i] || y[i] > ch - r[i]) {
            dy[i] = dy[i] *-1;
        }
        // move the circle
        x[i] += dx[i]
        y[i] += dy[i]
    }    
}

setInterval(draw, 30);