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

function draw() {
  background(0);

  // smooth easing toward target
  camX = lerp(camX, targetCamX, EASE);

  let scaledW = worldImg.width * scaleFactor;
  let scaledH = height;

  image(worldImg, -camX * scaleFactor, 0, scaledW, scaledH);

  drawArrows();

// sync HTML items with camera
let scaledF = height / worldImg.height;
document.querySelectorAll('.market-item').forEach(el => {
  if (el === dragEl || el._falling) return;
if (el.closest('.market-key')) return;

  if (el._onGround) {
    el.style.left = (el._groundWorldX * scaledF - camX * scaledF) + 'px';
    el.style.top  = (el._groundWorldY * scaledF) + 'px';
    return;
  }

  let wx = parseFloat(el.dataset.worldx);
  let wy = parseFloat(el.dataset.worldy);
  let sx = wx * scaledF - camX * scaledF;
  let sy = wy * scaledF;
  el.style.left = sx + 'px';
  el.style.top = sy + 'px';
});
}

function drawArrows() {
  let arrowY = height - ARROW_SIZE - 20;

  let leftX = 120;
  let rightX = width - 120;

  let maxCam = (worldImg.width - width / scaleFactor);

  // LEFT
  if (camX > 1) {
    image(
      arrowLeft,
      leftX - ARROW_SIZE / 2,
      arrowY,
      ARROW_SIZE,
      ARROW_SIZE
    );
  }

  // RIGHT
  if (targetCamX < maxCam - 1) {
    image(
      arrowRight,
      rightX - ARROW_SIZE / 2,
      arrowY,
      ARROW_SIZE,
      ARROW_SIZE
    );
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

// ============================================================
//  DRAG, GRAVITY & SNAP FOR HTML ITEMS
// ============================================================

let dragEl = null;
let dragOffX = 0;
let dragOffY = 0;
let velX = 0;
let velY = 0;
let isDragging = false;
let animating = [];

const GRAVITY = 0.6;
const BOUNCE = 0.25;
const SNAP_RADIUS = 80;
const GROUND_OFFSET = 0.88; // fraction of window height

document.querySelectorAll('.market-item').forEach(el => {
  // store original world position
  el._homeWorldX = parseFloat(el.dataset.worldx);
  el._homeWorldY = parseFloat(el.dataset.worldy);
  el._velX = 0;
  el._velY = 0;
  el._falling = false;

  el.addEventListener('mousedown', (e) => {
    e.preventDefault();

    // stop any existing animation on this element
    el._falling = false;
    el._onGround = false;

    dragEl = el;
    isDragging = false;
    dragOffX = e.clientX - el.getBoundingClientRect().left;
    dragOffY = e.clientY - el.getBoundingClientRect().top;
    el._startX = e.clientX;
    el._startY = e.clientY;
    el._prevX = e.clientX;
    el._prevY = e.clientY;
    el.style.transition = 'none';
    el.style.zIndex = 100;
    el._onGround = false;
  });
});

document.addEventListener('mousemove', (e) => {
  if (!dragEl) return;

  // check if actually dragging
  let dx = e.clientX - dragEl._startX;
  let dy = e.clientY - dragEl._startY;
  if (Math.abs(dx) > 5 || Math.abs(dy) > 5) isDragging = true;

  if (!isDragging) return;

  // track velocity
  dragEl._velX = e.clientX - dragEl._prevX;
  dragEl._velY = e.clientY - dragEl._prevY;
  dragEl._prevX = e.clientX;
  dragEl._prevY = e.clientY;
