var pic;
 
function preload(){
pic=loadImage("data/handfork_01.png");
}
function setup() {
createCanvas(windowWidth, windowHeight);
background("black");
imageMode(CENTER, CENTER);
}
function draw() {
scale(2);
image(pic, mouseX/2, mouseY/2);
}
