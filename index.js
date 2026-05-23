let camX = 0;
let targetCamX = 0;
let worldImg;
let arrowLeft, arrowRight;
let scaleFactor = 1;
let startOffset = 1250;

const ARROW_SIZE = 200;
const SCROLL_AMOUNT = 2000;
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

  // move element
  dragEl.style.left = (e.clientX - dragOffX) + 'px';
  dragEl.style.top  = (e.clientY - dragOffY) + 'px';
});

document.addEventListener('mouseup', (e) => {
  if (!dragEl) return;

  if (!isDragging) {
    // it was a click — navigate if link exists
    let link = dragEl.dataset.link;
    if (link) window.location.href = link;
    dragEl.style.zIndex = 10;
    dragEl = null;
    return;
  }

  // check distance from home position (in screen space)
  let scaledF = height / worldImg.height;
  let homeScreenX = dragEl._homeWorldX * scaledF - camX * scaledF;
  let homeScreenY = dragEl._homeWorldY * scaledF;
  let curX = parseFloat(dragEl.style.left);
  let curY = parseFloat(dragEl.style.top);
  let dist = Math.sqrt((curX - homeScreenX) ** 2 + (curY - homeScreenY) ** 2);

if (dist < SNAP_RADIUS) {
    // snap back home — let draw loop take over
    dragEl._falling = false;
    dragEl._onGround = false;
    dragEl._snappedHome = false;
    dragEl.style.transition = 'none';
    dragEl.style.zIndex = 10;
  } else {
    // let it fall with gravity
    dragEl._velX = dragEl._velX * 0.5;
    dragEl._velY = dragEl._velY * 0.5;
    dragEl._falling = true;
    animating.push(dragEl);
  }

  dragEl = null;
  isDragging = false;
});

// ============================================================
//  GRAVITY ANIMATION LOOP
// ============================================================
function animateGravity() {
  let groundY = window.innerHeight * GROUND_OFFSET;

  animating.forEach(el => {
    if (!el._falling) return;

    el._velY += GRAVITY;
    let curX = parseFloat(el.style.left);
    let curY = parseFloat(el.style.top);
    let newX = curX + el._velX;
    let newY = curY + el._velY;

    // ground collision
    let elH = el.offsetHeight;
    if (newY + elH >= groundY) {
      newY = groundY - elH;
      el._velY *= -BOUNCE;
      el._velX *= 0.85;

if (Math.abs(el._velY) < 1) {
  el._velY = 0;
  el._velX = 0;
  el._falling = false;
  el._onGround = true;
  // save ground position in world space
  let scaledF = height / worldImg.height;
  el._groundWorldX = (newX + camX * scaledF) / scaledF;
  el._groundWorldY = newY / scaledF;
}
    }

    el.style.left = newX + 'px';
    el.style.top  = newY + 'px';
  });

  // clean up settled items
  animating = animating.filter(el => el._falling);

  requestAnimationFrame(animateGravity);
}

animateGravity();

const cursor = document.querySelector(".cursor");
const cursorImg = document.querySelector(".cursor img");

/* cursor images */
const defaultCursor = "images/index-cursor-default.png";
const hoverCursor = "images/index-cursor-hover.png";

/* move cursor */
document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

/* selectable items */
const interactables = document.querySelectorAll(".has-link");

/* hover effects */
interactables.forEach(item => {

  item.addEventListener("mouseenter", () => {
    cursorImg.src = hoverCursor;
  });

  item.addEventListener("mouseleave", () => {
    cursorImg.src = defaultCursor;
  });

});

/* js for market key */

const keyItems = document.querySelectorAll(".key-item");

keyItems.forEach(item => {

  item.addEventListener("click", () => {

    const newCamX = parseFloat(item.dataset.camx);

    targetCamX = newCamX;

  });

});
