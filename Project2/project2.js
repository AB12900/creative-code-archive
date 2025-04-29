let shapes = [];
const numShapes = 50; 
const minDistance = 50; 

function setup() {
    createCanvas(windowWidth, windowHeight);
    for (let i = 0; i < numShapes; i++) {
        shapes.push(new MovingShape(random(width), random(height)));
    }
}

function draw() {
    background(30);
    for (let shape of shapes) {
        shape.applySeparation(shapes); 
        shape.update();
        shape.display();
    }
}

class MovingShape {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.size = random(30, 50);
        this.angle = 0;
    }

    update() {
        let target = createVector(mouseX, mouseY);
        let direction = p5.Vector.sub(target, this.pos);
        direction.setMag(0.1); 

        this.acc = direction;
        this.vel.add(this.acc);
        this.vel.limit(3);
        this.pos.add(this.vel);

        this.angle = this.vel.heading();
    }

    display() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.angle);
        fill(0, 200, 255);
        noStroke();
        rectMode(CENTER);
        rect(0, 0, this.size, this.size * 0.6);
        pop();
    }

    
    applySeparation(shapes) {
        for (let other of shapes) {
            if (other !== this) {
                let distance = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
                if (distance < minDistance) {
                    let repel = p5.Vector.sub(this.pos, other.pos);
                    repel.setMag(0.05); 
                    this.vel.add(repel);
                }
            }
        }
    }
}
