let pos = 0;
function setup(){
    createCanvas(windowWidth, windowHeight);
    noiseSeed(2);
    noiseDetail(10,0.1);
}

function draw(){
    background(0,0);
    let x = map(noise(pos),0,1,0,width);
    let y = map(noise(pos + 5),0,1,0,height);
    fill(149);
    ellipse(x,y,20,20);
    pos += 0.01;
    if(pos > 10){
        pos = 0;
    }
}
