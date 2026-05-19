// ── Add your slides here ──
  const slides = [
    { img: '', label: 'Slide 1', bg: '#9e9e8e' },
    { img: '', label: 'Slide 2', bg: '#c4603a' },
    { img: '', label: 'Slide 3', bg: '#6b7c45' },
    { img: '', label: 'Slide 4', bg: '#a8c8d0' },
    { img: '', label: 'Slide 5', bg: '#c8b89a' },
    { img: '', label: 'Slide 6', bg: '#d8a090' },
    { img: '', label: 'Slide 7', bg: '#7a6a52' },
  ];
  // To use images replace '' with your image path e.g. 'images/photo1.jpg'

  const track = document.getElementById('track');
  const dotsEl = document.getElementById('dots');
  let current = 0;

  // build cards
  const cards = slides.map((slide, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = i;

    if (slide.img) {
      card.innerHTML = `<img src="${slide.img}" alt="${slide.label}">`;
    } else {
      card.innerHTML = `<div class="card-placeholder" style="background:${slide.bg}">${slide.label}</div>`;
      // set explicit size on placeholder div
      card.querySelector('.card-placeholder').style.width = '100%';
      card.querySelector('.card-placeholder').style.height = '100%';
    }

    card.addEventListener('click', () => {
      if (i !== current) goTo(i);
    });

    track.appendChild(card);
    return card;
  });

  // build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    render();
  }

  function render() {
    const total = slides.length;
    const dotEls = dotsEl.querySelectorAll('.dot');

    cards.forEach((card, i) => {
      const diff = ((i - current + total) % total);
      const mirror = diff > total / 2 ? diff - total : diff;
      // mirror: 0 = active, ±1 = side, ±2 = far, else hidden

      card.className = 'card';

      if (mirror === 0)       card.classList.add('active');
      else if (Math.abs(mirror) === 1) card.classList.add('side');
      else if (Math.abs(mirror) === 2) card.classList.add('far');
      else                    card.classList.add('hidden');
    });

    // reorder DOM so center is visually on top
    const order = [];
    for (let d = -2; d <= 2; d++) {
      const idx = ((current + d) + total) % total;
      order.push(idx);
    }
    order.forEach(idx => track.appendChild(cards[idx]));

    dotEls.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  document.getElementById('prev').addEventListener('click', () => goTo(current - 1));
  document.getElementById('next').addEventListener('click', () => goTo(current + 1));

  // keyboard arrows
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  render();