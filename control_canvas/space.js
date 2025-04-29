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
pane.addInput(PARAMS, 'max_shooting', { min: 1, max: 200, step: 1 });
pane.addInput(PARAMS, 'pause');

let shootingStars = [];
let backgroundStars = [];
let hidden = false;

function setup() {
    createCanvas(windowWidth, windowHeight);
    generateBackgroundStars(200); // number of stars
}

function draw() {
    if (PARAMS.pause) return;

    background(0, 50); 

    // Background Stars
    noStroke();
    fill(255);
    for (let s of backgroundStars) {
        ellipse(s.x, s.y, s.size);
    }

    // spawn new shooting stars
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
}

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
        if (side === 'top') {
            this.x = random(width);
            this.y = random(-100, -10);
            this.vx = PARAMS.star_speed;
            this.vy = PARAMS.star_speed * 0.5;
        } else if (side === 'left') {
            this.x = random(-100, -10);
            this.y = random(height);
            this.vx = PARAMS.star_speed;
            this.vy = PARAMS.star_speed * 0.5;  
        }
        this.size = PARAMS.star_size;
        this.color = color(PARAMS.star_color);
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
        return (this.x > width + 50 || this.y > height + 50);
    }
}

function keyPressed() {
    if (key === 'h') {
        hidden = !hidden;
        pane.hidden = hidden;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    generateBackgroundStars(200);
}
