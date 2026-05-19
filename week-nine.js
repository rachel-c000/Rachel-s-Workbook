let capture;
let frameImg;

function preload() {
  frameImg = loadImage("images/album-cover.png"); // your PNG
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  clear(); 

  capture = createCapture(VIDEO);
  capture.size(600, 400);
  capture.hide();
}

function draw() {
clear();

  // 1. draw webcam FIRST (background layer)
  image(capture, 200, 0, 500, 400);

  // 2. draw PNG ON TOP
  image(frameImg, 105, -20, 640, 480);
}

