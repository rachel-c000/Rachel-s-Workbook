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

// ── Lily pad cards ──
document.querySelectorAll('.lillypad-card').forEach(card => {

  let dragging = false;
  let offsetX, offsetY;

  card.addEventListener('mousedown', e => {
    if (e.target.classList.contains('lillypad-close')) return;
    dragging = true;
    isDraggingPad = true;
    offsetX = e.clientX - card.getBoundingClientRect().left;
    offsetY = e.clientY - card.getBoundingClientRect().top;
    card.style.zIndex = 150;
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
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

  front.addEventListener('click', () => {
    const rect = card.getBoundingClientRect();
    back.style.left = (rect.right + 10) + 'px';
    back.style.top  = rect.top + 'px';
    back.classList.add('open');
  });

  closeBtn.addEventListener('click', () => {
    back.classList.remove('open');
  });
});

document.querySelectorAll('img').forEach(img => {
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
});
