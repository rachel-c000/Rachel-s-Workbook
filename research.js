const slides = [
  {
    img: 'images/angela-bulloch.jpg',
    label: 'Slide 1',
    bg: '#c8b89a',
    title: 'Angela Bulloch',
    desc: 'Angela Bulloch is a Canadian-born, Berlin-based artist known for her work in installation, sculpture, and digital media. Her practice explores systems, rules, and interactivity, often using technology and light to create immersive environments that engage audiences in dynamic and participatory ways.'
  },
  {
    img: 'images/amalia-ulman.jpg',
    label: 'Slide 2',
    bg: '#a8c8d0',
    title: 'Amalia Ulman',
    desc: 'Amalia Ulman is an Argentine-Spanish artist and filmmaker whose work critically examines identity, consumer culture, and social media. She is best known for blending fiction and reality in digital spaces, using platforms like Instagram to create narrative-driven performances that challenge perceptions of authenticity.'
  },
  {
    img: 'images/bruno-simon.jpg',
    label: 'Slide 3',
    bg: '#9e9e8e',
    title: 'Bruno Simon',
    desc: 'Bruno Simon is a French creative developer recognized for his interactive and playful web experiences. Specializing in 3D and WebGL, his work combines technical skill with humor and creativity, pushing the boundaries of how users engage with websites and digital environments.'
  },
  {
    img: 'images/wacky-website2.png',
    label: 'Slide 4',
    bg: '#c4603a',
    title: 'Wacky Website',
    desc: 'This project explores unconventional web design through experimental layouts, bold visuals, and unexpected interactions. It challenges traditional usability norms while maintaining engagement, demonstrating how creativity and unpredictability can redefine user experience online.'
  },
  {
    img: 'images/wacky-website1.png',
    label: 'Slide 5',
    bg: '#6b7c45',
    title: 'Experimental Web Design',
    desc: 'Experimental web design focuses on breaking standard design rules to create unique and memorable user experiences. By combining unusual navigation, visuals, and interactivity, it encourages users to explore digital spaces in new and engaging ways.'
  },
  {
    img: 'images/carsten-holler.jpg',
    label: 'Slide 6',
    bg: '#a8c8d0',
    title: 'Carsten Höller',
    desc: 'Carsten Höller is a German artist known for large-scale interactive installations that invite audience participation. His works often incorporate scientific principles and playful elements, encouraging viewers to question perception, experience, and human behavior.'
  },
  {
    img: 'images/angela-bulloch.jpg',
    label: 'Slide 7',
    bg: '#c8b89a',
    title: 'Angela Bulloch (Extended)',
    desc: 'Bulloch’s work continues to explore the relationship between systems, audience interaction, and digital processes. Through light, code, and modular structures, she creates environments that blur the line between art, design, and technology.'
  },
  {
    img: 'images/daniel-palacios.jpg',
    label: 'Slide 8',
    bg: '#d8a090',
    title: 'Daniel Palacios',
    desc: 'Daniel Palacios is a Spanish artist who works with kinetic installations that respond to sound and movement. His pieces often involve suspended objects and immersive environments, translating audio into physical motion to create sensory experiences.'
  },
  {
    img: 'images/yoko-ono.jpg',
    label: 'Slide 9',
    bg: '#7a6a52',
    title: 'Yoko Ono',
    desc: 'Yoko Ono is a pioneering conceptual and performance artist whose work emphasizes participation, peace, and imagination. Through simple instructions and interactive pieces, she invites audiences to become co-creators, reshaping the role of the viewer in art.'
  },
  {
    img: 'images/osheen-siva.jpg',
    label: 'Slide 10',
    bg: '#c4603a',
    title: 'Osheen Siva',
    desc: 'Osheen Siva is a visual artist and illustrator whose work blends digital aesthetics with cultural identity. Her bold, futuristic style explores themes of gender, technology, and representation, creating striking and empowering visual narratives.'
  },
  {
    img: 'images/lynn-fisher.jpg',
    label: 'Slide 11',
    bg: '#6b7c45',
    title: 'Lynn Fisher',
    desc: 'Lynn Fisher is a designer and developer known for creative coding projects and data-driven design. Her work often transforms information into visually engaging formats, combining storytelling with digital experimentation.'
  },
  {
    img: 'images/ettore-sottsass.jpg',
    label: 'Slide 12',
    bg: '#a8c8d0',
    title: 'Ettore Sottsass',
    desc: 'Ettore Sottsass was an influential Italian designer and architect, best known for founding the Memphis Group. His work challenged modernist design principles through bold colors, playful forms, and a focus on emotional expression in everyday objects.'
  }
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
  card.innerHTML = `
    <img src="${slide.img}" alt="${slide.label}">
    <div class="card-info">
      <h2 class="card-title">${slide.title || ''}</h2>
      <p class="card-desc">${slide.desc || ''}</p>
    </div>
  `;
} else {
  card.innerHTML = `
    <div class="card-placeholder" style="background:${slide.bg}">${slide.label}</div>
    <div class="card-info">
      <h2 class="card-title">${slide.title || ''}</h2>
      <p class="card-desc">${slide.desc || ''}</p>
    </div>
  `;
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
