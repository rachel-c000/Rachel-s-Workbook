let camX = 0;
let targetCamX = 0;
let worldImg;
let arrowLeft, arrowRight;
let scaleFactor = 1;
let startOffset = 4000; // tweak this to land on your middle stall

const ARROW_SIZE = 80;
const SCROLL_AMOUNT = 2000;
const EASE = 0.08;

function preload() {
  worldImg = loadImage("images/Index.png");
  arrowLeft = loadImage("images/arrow-left.png");
  arrowRight = loadImage("images/arrow-right.png");
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style('display', 'block');

  scaleFactor = height / worldImg.height;
  camX = startOffset;
  targetCamX = startOffset;
}

function draw() {
  background(0);

  // smooth easing toward target
  camX = lerp(camX, targetCamX, EASE);

  let scaledW = worldImg.width * scaleFactor;
  let scaledH = height;

  image(worldImg, -camX * scaleFactor, 0, scaledW, scaledH);

  drawArrows();
}

function drawArrows() {
  let arrowY = height - ARROW_SIZE - 20; // near bottom
  let leftX = 60;                         // left arrow X center
  let rightX = width - 60;               // right arrow X center

  // left arrow — only show if not at start
  if (camX > 1) {
    if (isHoveringLeft()) tint(255, 200);
    else tint(255, 180);
    image(arrowLeft, leftX - ARROW_SIZE / 2, arrowY, ARROW_SIZE, ARROW_SIZE);
    noTint();
  }

  // right arrow — only show if not at end
  let maxCam = (worldImg.width - width / scaleFactor);
  if (targetCamX < maxCam - 1) {
    if (isHoveringRight()) tint(255, 200);
    else tint(255, 180);
    image(arrowRight, rightX - ARROW_SIZE / 2, arrowY, ARROW_SIZE, ARROW_SIZE);
    noTint();
  }
}

function mousePressed() {
  let maxCam = worldImg.width - width / scaleFactor;

  if (isHoveringLeft()) {
    targetCamX = constrain(targetCamX - SCROLL_AMOUNT, 0, maxCam);
  }
  if (isHoveringRight()) {
    targetCamX = constrain(targetCamX + SCROLL_AMOUNT, 0, maxCam);
  }
}

function isHoveringLeft() {
  let arrowY = height - ARROW_SIZE - 20;
  let leftX = 60;
  return mouseX > leftX - ARROW_SIZE / 2 && mouseX < leftX + ARROW_SIZE / 2 &&
         mouseY > arrowY && mouseY < arrowY + ARROW_SIZE;
}

function isHoveringRight() {
  let arrowY = height - ARROW_SIZE - 20;
  let rightX = width - 60;
  return mouseX > rightX - ARROW_SIZE / 2 && mouseX < rightX + ARROW_SIZE / 2 &&
         mouseY > arrowY && mouseY < arrowY + ARROW_SIZE;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  scaleFactor = height / worldImg.height;
}