  const cursor = document.getElementById('cursor');
  const hint = document.getElementById('hint');
 
  const chars = [
    '~', '-', '.', ',', "'", '`',
    '*', 'x', 'o', 'v', 'w',
    '/', '\\', '_',
    'a', 'e', 'i', 'o', 'r', 's', 't', 'n', 'm',
  ];
 
  const colors = [
    '#8a7a62', '#9a8a6a', '#7a6a52',
    '#b0a080', '#6a5a42', '#a09070', '#c0b090',
  ];
 
  let mouseX = 0, mouseY = 0;
  let prevMouseX = 0, prevMouseY = 0;
  let isMoving = false;
  let moveTimer = null;
  let frame = 0;
 
  const POOL_SIZE = 80;
  const pool = [];
  let poolHead = 0;
 
  for (let i = 0; i < POOL_SIZE; i++) {
    const el = document.createElement('div');
    el.className = 'ascii-char';
    el.style.opacity = '0';
    document.body.appendChild(el);
    pool.push({ el, x: 0, y: 0, life: 0, maxLife: 0, vx: 0, vy: 0 });
  }
 
  function spawnChar(x, y) {
    const p = pool[poolHead % POOL_SIZE];
    poolHead++;
 
    const char = chars[Math.floor(Math.random() * chars.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 11 + Math.random() * 10;
    const maxLife = 80 + Math.random() * 80;
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.1 + Math.random() * 0.35;
 
    p.x = x + (Math.random() - 0.5) * 6;
    p.y = y + (Math.random() - 0.5) * 6;
    p.life = maxLife;
    p.maxLife = maxLife;
    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed;
 
    p.el.textContent = char;
    p.el.style.fontSize = size + 'px';
    p.el.style.color = color;
    p.el.style.left = p.x + 'px';
    p.el.style.top  = p.y + 'px';
    p.el.style.opacity = '0.8';
    p.el.style.textShadow = 'none';
  }
 
  function tick() {
    frame++;
 
    if (isMoving && frame % 3 === 0) {
      spawnChar(mouseX, mouseY);
    }
 
    for (let i = 0; i < POOL_SIZE; i++) {
      const p = pool[i];
      if (p.life <= 0) continue;
 
      p.life--;
      p.x += p.vx;
      p.y += p.vy;
 
      const t = p.life / p.maxLife;
      p.el.style.left = p.x + 'px';
      p.el.style.top  = p.y + 'px';
      p.el.style.opacity = (t * 0.75).toFixed(3);
 
      if (p.life <= 0) p.el.style.opacity = '0';
    }
 
    requestAnimationFrame(tick);
  }
 
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
 
    const dx = mouseX - prevMouseX;
    const dy = mouseY - prevMouseY;
    if (Math.sqrt(dx * dx + dy * dy) > 2) {
      isMoving = true;
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      hint.classList.add('hidden');
      clearTimeout(moveTimer);
      moveTimer = setTimeout(() => { isMoving = false; }, 80);
    }
  });
 
  tick();