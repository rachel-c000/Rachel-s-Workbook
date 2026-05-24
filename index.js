let camX = 0;
let targetCamX = 0;
let worldImg;
let arrowLeft, arrowRight;
let scaleFactor = 1;
let startOffset = 1500;

const ARROW_SIZE = 200;
const SCROLL_AMOUNT = 900;
const EASE = 0.08;

function preload() {
  worldImg = loadImage("images/blank-canvas.jpg");
  arrowLeft = loadImage("images/left-arrow.png");
  arrowRight = loadImage("images/right-arrow.png");
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style('display', 'block');
  canvas.style('position', 'fixed'); // add this
  canvas.style('z-index', '0');      // add this

  scaleFactor = height / worldImg.height;
  camX = startOffset;
  targetCamX = startOffset;
}
