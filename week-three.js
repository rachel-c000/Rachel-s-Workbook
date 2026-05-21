let isDraggingPad = false;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('position', 'fixed');
  canvas.style('top', '0');
  canvas.style('left', '0');
  canvas.style('z-index', '-1');
  background(0, 0, 255);
}

function draw() {
  if (mouseIsPressed && !isDraggingPad) {
    stroke(111, 100, 255);
    strokeWeight(4);
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

document.querySelectorAll('.lillypad-card').forEach(card => {

  let dragging = false;
  let hasMoved = false;       
  let offsetX, offsetY;

  card.addEventListener('mousedown', e => {
    if (e.target.classList.contains('lillypad-close')) return;
    dragging = true;
    hasMoved = false;         
    isDraggingPad = true;
    offsetX = e.clientX - card.getBoundingClientRect().left;
    offsetY = e.clientY - card.getBoundingClientRect().top;
    card.style.zIndex = 150;
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    hasMoved = true;           // ← flag that a real drag occurred
    card.style.left = (e.clientX - offsetX) + 'px';
    card.style.top  = (e.clientY - offsetY) + 'px';
  });

  document.addEventListener('mouseup', () => {
    dragging = false;
    isDraggingPad = false;
    card.style.zIndex = 100;
  });

  const front = card.querySelector('.lillypad-front');
  const back  = card.querySelector('.lillypad-back');
  const closeBtn = card.querySelector('.lillypad-close');

  front.addEventListener('mouseup', () => {
    if (hasMoved) return;      
    document.querySelectorAll('.lillypad-back').forEach(b => b.classList.remove('open'));
    back.classList.add('open');
    backdrop.classList.add('open');
  });

  closeBtn.addEventListener('click', () => {
    back.classList.remove('open');
    backdrop.classList.remove('open');
  });
});

document.querySelectorAll('img:not(.nav-links img)').forEach(img => {
  img.style.cursor = 'grab';

  img.addEventListener('mousedown', e => {
    e.preventDefault();
    isDraggingPad = true;
    img.style.cursor = 'grabbing';

    const rect = img.getBoundingClientRect();
    let offsetX = e.clientX - rect.left;
    let offsetY = e.clientY - rect.top;

    img.style.position = 'absolute';
    img.style.right = 'auto';
    img.style.left = rect.left + 'px';
    img.style.top = rect.top + 'px';
    img.style.zIndex = 200;

    function onMouseMove(e) {
      img.style.left = (e.clientX - offsetX) + 'px';
      img.style.top  = (e.clientY - offsetY) + 'px';
    }

    function onMouseUp() {
      isDraggingPad = false;
      img.style.cursor = 'grab';
      img.style.zIndex = '';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
  // ── Touch support ──
  card.addEventListener('touchstart', e => {
    const touch = e.touches[0];
    dragging = true;
    hasMoved = false;
    isDraggingPad = true;
    offsetX = touch.clientX - card.getBoundingClientRect().left;
    offsetY = touch.clientY - card.getBoundingClientRect().top;
    card.style.zIndex = 150;
  }, { passive: true });

  card.addEventListener('touchmove', e => {
    if (!dragging) return;
    hasMoved = true;
    const touch = e.touches[0];
    card.style.left = (touch.clientX - offsetX) + 'px';
    card.style.top  = (touch.clientY - offsetY) + 'px';
  }, { passive: true });

  card.addEventListener('touchend', () => {
    dragging = false;
    isDraggingPad = false;
    card.style.zIndex = 100;
    if (!hasMoved) {
      document.querySelectorAll('.lillypad-back').forEach(b => b.classList.remove('open'));
      back.classList.add('open');
      backdrop.classList.add('open');
    }
  });
});

// for the spinner!

let rotation = 0;
let spinning = false;
let stopTimer;

document.addEventListener('mousemove', () => {
  rotation += 8;
  document.getElementById('spinner').style.transform = `rotate(${rotation}deg)`;

  if (!spinning) spinning = true;

  clearTimeout(stopTimer);
  stopTimer = setTimeout(() => {
    spinning = false;
  }, 100);
});

const backdrop = document.querySelector('.lillypad-backdrop');

front.addEventListener('click', () => {
  back.classList.add('open');
  backdrop.classList.add('open');
});

closeBtn.addEventListener('click', () => {
  back.classList.remove('open');
  backdrop.classList.remove('open');
});


backdrop.addEventListener('click', () => {
  document.querySelectorAll('.lillypad-back').forEach(b => b.classList.remove('open'));
  backdrop.classList.remove('open');
});

