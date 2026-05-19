// ── Helper: generate sequential frame paths ─────────────────────────────────
function generateFramePaths(prefix, start, end, ext) {
  const paths = [];
  const digits = String(end).length;
  for (let i = start; i <= end; i++) {
    paths.push(prefix + String(i).padStart(digits, '0') + ext);
  }
  return paths;
}

// ── ANIMATIONS — defined first so everything below can reference it ───────────
const ANIMATIONS = [
  {
    label: 'flower 01',
    paths: generateFramePaths('./animation-one/frame', 1, 60, '.png'),
  },
  {
    label: 'flower 02',
    paths: generateFramePaths('./animation-two/frame', 1, 60, '.png'),
  },
  {
    label: 'flower 03',
    paths: generateFramePaths('./animation-three/frame', 1, 60, '.png'),
  },
];

// ── CONFIGURATION ────────────────────────────────────────────────────────────
const CONFIG = {
  transition:  'hard',
  showCounter: true,
};

// ── Per-animation frame storage ──────────────────────────────────────────────
const frameBank   = ANIMATIONS.map(() => []);
const loadedCount = ANIMATIONS.map(() => 0);
const readyFlag   = ANIMATIONS.map(() => false);

// ── State ────────────────────────────────────────────────────────────────────
let activeAnim  = 0;
let scrollRatio = 0;

// ── Elements ─────────────────────────────────────────────────────────────────
const rightCol     = document.querySelector('.right-content');
const progressFill = document.getElementById('progress-bar-fill');
const frameCounter = document.getElementById('frame-counter');

// ── Build the flower-picker buttons ──────────────────────────────────────────
function buildSelector() {
  const panel = document.getElementById('anim-selector');
  if (!panel) return;
  ANIMATIONS.forEach((anim, i) => {
    const btn = document.createElement('button');
    btn.className = 'anim-btn' + (i === 0 ? ' anim-btn--active' : '');
    btn.textContent = anim.label;
    btn.addEventListener('click', () => switchAnimation(i));
    panel.appendChild(btn);
  });
}

function switchAnimation(index) {
  if (index === activeAnim) return;
  activeAnim = index;
  document.querySelectorAll('.anim-btn').forEach((btn, i) => {
    btn.classList.toggle('anim-btn--active', i === index);
  });
  rightCol.scrollTop = 0;
  scrollRatio = 0;
}

buildSelector();

// ── Scroll listener ───────────────────────────────────────────────────────────
rightCol.addEventListener('scroll', () => {
  const maxScroll = rightCol.scrollHeight - rightCol.clientHeight;
  scrollRatio = maxScroll > 0 ? rightCol.scrollTop / maxScroll : 0;
  if (progressFill) progressFill.style.width = (scrollRatio * 100) + '%';
}, { passive: true });

// ── p5 sketch ─────────────────────────────────────────────────────────────────
new p5(function (p) {

  p.preload = function () {
    ANIMATIONS.forEach((anim, animIdx) => {
      anim.paths.forEach((path, frameIdx) => {
        frameBank[animIdx][frameIdx] = p.loadImage(
          path,
          () => {
            loadedCount[animIdx]++;
            if (loadedCount[animIdx] === anim.paths.length) {
              readyFlag[animIdx] = true;
            }
          },
          () => {
            console.warn('Could not load:', path);
            loadedCount[animIdx]++;
            if (loadedCount[animIdx] === anim.paths.length) {
              readyFlag[animIdx] = true;
            }
          }
        );
      });
    });
  };

  p.setup = function () {
    const container = document.getElementById('p5-canvas-container');
    const cnv = p.createCanvas(container.offsetWidth, container.offsetHeight);
    cnv.parent('p5-canvas-container');
    p.imageMode(p.CENTER);
  };

  p.draw = function () {
    // Match the left panel's light green background
    p.background(177, 234, 104); // --light-green #b1ea68

    const frames  = frameBank[activeAnim];
    const isReady = readyFlag[activeAnim];

    if (!isReady || frames.length === 0) {
      p.fill(37, 66, 0, 160);
      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(13);
      p.textFont('Georgia');
      const count = loadedCount[activeAnim];
      const total = ANIMATIONS[activeAnim].paths.length;
      p.text('✿ loading ' + count + ' / ' + total + ' ✿', p.width / 2, p.height / 2);
      return;
    }

    const total      = frames.length;
    const exactIndex = scrollRatio * (total - 1);
    const loIdx      = Math.floor(exactIndex);
    const hiIdx      = Math.min(loIdx + 1, total - 1);
    const frac       = exactIndex - loIdx;

    if (CONFIG.transition === 'blend' && frames[hiIdx]) {
      drawFrame(p, frames[loIdx]);
      p.tint(255, frac * 255);
      drawFrame(p, frames[hiIdx]);
      p.noTint();
    } else {
      const nearest = Math.round(exactIndex);
      drawFrame(p, frames[Math.min(nearest, total - 1)]);
    }

    if (CONFIG.showCounter && frameCounter) {
      const display = Math.min(Math.round(exactIndex) + 1, total);
      frameCounter.textContent = display + ' / ' + total;
    }
  };

  p.windowResized = function () {
    const container = document.getElementById('p5-canvas-container');
    p.resizeCanvas(container.offsetWidth, container.offsetHeight);
  };

});

// ── Draw a single frame, scaled to fill ~90% of the canvas ───────────────────
function drawFrame(p, img) {
  if (!img || !img.width) return;

  const cw = p.width;
  const ch = p.height;
  const iw = img.width;
  const ih = img.height;

  // Contain: fill 90% of the panel without overflow
  const scaleW = (cw * 0.9) / iw;
  const scaleH = (ch * 0.9) / ih;
  const scale  = Math.min(scaleW, scaleH);

  p.image(img, cw / 2, ch / 2, iw * scale, ih * scale);
}

const cursor = document.querySelector(".cursor");
const cursorImg = document.querySelector(".cursor img");

/* cursor images */
const defaultCursor = "images/cursor-default.png";
const hoverCursor = "images/cursor-hover.png";

/* move cursor */
document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

/* selectable items */
const interactables = document.querySelectorAll("a, button");

/* hover effects */
interactables.forEach(item => {

  item.addEventListener("mouseenter", () => {
    cursorImg.src = hoverCursor;
  });

  item.addEventListener("mouseleave", () => {
    cursorImg.src = defaultCursor;
  });

});