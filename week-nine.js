let zTop = 10;

document.querySelectorAll('.win').forEach(win => {
  const bar = win.querySelector('.win-bar');
  const resizeHandle = win.querySelector('.win-resize');
  let dragging = false, resizing = false;
  let ox = 0, oy = 0, rox = 0, roy = 0, rw = 0, rh = 0;

  // focus on click
  win.addEventListener('mousedown', () => {
    document.querySelectorAll('.win').forEach(w => w.classList.remove('focused'));
    win.classList.add('focused');
    win.style.zIndex = ++zTop;
  });

  // drag
  bar.addEventListener('mousedown', e => {
    if (e.target.classList.contains('win-btn')) return;
    dragging = true;
    const r = win.getBoundingClientRect();
    ox = e.clientX - r.left;
    oy = e.clientY - r.top;
    e.preventDefault();
  });

  // resize
  resizeHandle.addEventListener('mousedown', e => {
    resizing = true;
    rox = e.clientX;
    roy = e.clientY;
    rw = win.offsetWidth;
    rh = win.querySelector('.win-body').offsetHeight;
    e.preventDefault();
    e.stopPropagation();
  });

  document.addEventListener('mousemove', e => {
    if (dragging) {
      win.style.left = (e.clientX - ox) + 'px';
      win.style.top  = (e.clientY - oy) + 'px';
    }
    if (resizing) {
      win.style.width = Math.max(280, rw + (e.clientX - rox)) + 'px';
      win.querySelector('.win-body').style.maxHeight = Math.max(120, rh + (e.clientY - roy)) + 'px';
    }
  });

  document.addEventListener('mouseup', () => { dragging = false; resizing = false; });

  // close
  win.querySelector('.close-btn').addEventListener('click', () => win.style.display = 'none');
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
