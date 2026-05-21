//--ipod--/
const ipod = document.querySelector('.ipod');

let ipodDragging = false;
let ipodOX = 0, ipodOY = 0;

ipod.addEventListener('mousedown', e => {
  ipodDragging = true;
  const r = ipod.getBoundingClientRect();
  ipodOX = e.clientX - r.left;
  ipodOY = e.clientY - r.top;
  ipod.style.transition = 'none';
  e.preventDefault();
});

document.addEventListener('mousemove', e => {
  if (!ipodDragging) return;
  ipod.style.left = (e.clientX - ipodOX) + 'px';
  ipod.style.top  = (e.clientY - ipodOY) + 'px';
});

document.addEventListener('mouseup', () => { ipodDragging = false; });


//--nav in ipod--/
const sections = [
  { id: 'section-interfaces', label: 'New Interfaces'    },
  { id: 'section-ball',       label: 'Ball Mouse'        },
  { id: 'section-words',      label: 'New Words'         },
  { id: 'section-avatar',     label: 'Avatar'            },
  { id: 'section-challenge',  label: '12hr Challenge'    },
  { id: 'section-hunter',     label: 'Hunter & Gatherer' },
];

const nav = document.createElement('nav');
nav.className = 'section-nav';

sections.forEach(({ id, label }) => {
  const a = document.createElement('a');
  a.href = '#' + id;
  a.textContent = label;
  a.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  });
  nav.appendChild(a);
});

ipod.appendChild(nav);

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      nav.querySelectorAll('a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(({ id }) => {
  const el = document.getElementById(id);
  if (el) observer.observe(el);
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

