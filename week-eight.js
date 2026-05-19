const slots = [
    { label: 'SLOT 1', title: 'Slot One', body: 'Add your content for slot 1 here.', tag: 'Item 1' },
    { label: 'SLOT 2', title: 'Slot Two', body: 'Add your content for slot 2 here.', tag: 'Item 2' },
    { label: 'SLOT 3', title: 'Slot Three', body: 'Add your content for slot 3 here.', tag: 'Item 3' },
    { label: 'SLOT 4', title: 'Slot Four', body: 'Add your content for slot 4 here.', tag: 'Item 4' },
    { label: 'SLOT 5', title: 'Slot Five', body: 'Add your content for slot 5 here.', tag: 'Item 5' },
    { label: 'SLOT 6', title: 'Slot Six', body: 'Add your content for slot 6 here.', tag: 'Item 6' },
    { label: 'SLOT 7', title: 'Slot Seven', body: 'Add your content for slot 7 here.', tag: 'Item 7' },
    { label: 'SLOT 8', title: 'Slot Eight', body: 'Add your content for slot 8 here.', tag: 'Item 8' },
    { label: 'SLOT 9', title: 'Slot Nine', body: 'Add your content for slot 9 here.', tag: 'Item 9' },
    { label: 'SLOT 10', title: 'Slot Ten', body: 'Add your content for slot 10 here.', tag: 'Item 10' },
  ];
 
  const ring = document.getElementById('dialRing');
  const centerText = document.getElementById('centerText');
  const openBtn = document.getElementById('openBtn');
  const hint = document.getElementById('hint');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
 
  const RING_R = 170;   // radius of dial ring (px from centre)
  const CENTRE = 240;   // centre of 480px scene
  const HOLE_START_DEG = -60; // top area start angle
  const HOLE_SPAN_DEG  = 280; // degrees available for holes (leaves gap at notch side)
 
  let currentRotation = 0;
  let selectedIndex = null;
 
  // Build holes on the ring
  slots.forEach((slot, i) => {
    const angleDeg = HOLE_START_DEG + (i / (slots.length - 1)) * HOLE_SPAN_DEG;
    const angleRad = (angleDeg * Math.PI) / 180;
 
    const hole = document.createElement('div');
    hole.className = 'hole';
    hole.dataset.index = i;
    hole.dataset.angle = angleDeg;
 
    // position on ring
    const x = CENTRE + RING_R * Math.cos(angleRad);
    const y = CENTRE + RING_R * Math.sin(angleRad);
    hole.style.left = x + 'px';
    hole.style.top  = y + 'px';
 
    hole.innerHTML = `<span class="hole-label">${slot.label}</span>`;
    hole.addEventListener('click', () => selectSlot(i, angleDeg));
    ring.appendChild(hole);
  });
 
  function selectSlot(index, angleDeg) {
    // remove active from all
    document.querySelectorAll('.hole').forEach(h => h.classList.remove('active'));
    document.querySelector(`.hole[data-index="${index}"]`).classList.add('active');
 
    selectedIndex = index;
 
    // rotate ring so selected hole comes to the notch position (right, 0deg)
    // notch is at 0deg, hole is at angleDeg — rotate ring by -angleDeg
    currentRotation = -angleDeg;
    ring.style.transform = `rotate(${currentRotation}deg)`;
 
    // counter-rotate each hole label so text stays upright
    document.querySelectorAll('.hole').forEach(h => {
      h.style.transform = `translate(-50%, -50%) rotate(${-currentRotation}deg)`;
    });
 
    centerText.classList.add('preview');
    centerText.textContent = slots[index].title.toUpperCase();
 
    openBtn.disabled = false;
    hint.textContent = `"${slots[index].title}" selected — press Open`;
  }
 
  // Open button
  openBtn.addEventListener('click', () => {
    if (selectedIndex === null) return;
    const slot = slots[selectedIndex];
    document.getElementById('modalTitle').textContent = slot.title;
    document.getElementById('modalBody').textContent = slot.body;
    document.getElementById('modalTag').textContent = slot.tag;
    modalOverlay.classList.add('open');
  });
 
  // Close modal
  modalClose.addEventListener('click', () => modalOverlay.classList.remove('open'));
  modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) modalOverlay.classList.remove('open');
  });