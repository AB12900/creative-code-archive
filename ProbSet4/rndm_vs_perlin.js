let particles = [];
let pane;
let params = {
    num_particles: 300,
    speed: 0.01,
    noise_strength: 0.05,
    particle_size: 5,
    color: 180 
};

function setup() {
    createCanvas(windowWidth, windowHeight);
    
    colorMode(HSB, 360, 100, 100, 255);

    createParticles();

    console.log("Tweakpane:", Tweakpane);
    
    pane = new Tweakpane.Pane();

    pane.addInput(params, "num_particles", { min: 50, max: 500, step: 10 }).on("change", createParticles);
    pane.addInput(params, "speed", { min: 0.001, max: 0.05, step: 0.001 });
    pane.addInput(params, "noise_strength", { min: 0, max: 1, step: 0.01 });
    pane.addInput(params, "particle_size", { min: 2, max: 15, step: 1 });
    pane.addInput(params, "color", { min: 0, max: 360 }); 
}

function createParticles() {
    particles = [];
    for (let i = 0; i < params.num_particles; i++) {
        particles.push(new Particle());
    }
}

function draw() {
    background(0, 20);

    for (let p of particles) {
        p.update();
        p.display();
    }
}

class Particle {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.noiseOffset = createVector(random(1000), random(1000));
    }

    update() {
        let mouseVec = createVector(mouseX, mouseY);
        
        let direction = p5.Vector.sub(mouseVec, this.pos);
        direction.setMag(params.speed * 300);
    
        this.pos.add(direction);

        if (this.pos.x > width) this.pos.x = 0;
        if (this.pos.x < 0) this.pos.x = width;
        if (this.pos.y > height) this.pos.y = 0;
        if (this.pos.y < 0) this.pos.y = height;
    }

    display() {
        fill(params.color, 100, 100); 
        noStroke();
        ellipse(this.pos.x, this.pos.y, params.particle_size);
    }
}

