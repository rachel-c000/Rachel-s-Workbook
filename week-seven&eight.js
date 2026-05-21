const clusters = [
  {
    x: 309, y: 160,
    count: 1,
    images: ['images/mmaterial.JPG', 'images/tinkercad-inmyheadspace.png'],
    title: 'The Materials',
    tag: 'In my headspace!',
    body: 'Amongst other materials in the boxes, ultrasonic senors was one that we experimented with in class. These sensors detect how far away external objects are to them (this scale can be coded into the attached Arduino.',
    allImages: ['images/tinkercad-inmyheadspace.png', 'images/mmaterial.JPG', 'images/photo3.jpg']
  },
  {
    x: 500, y: 220,
    count: 2,
    images: ['images/pproject.png', 'images/photo5.jpg'],
    title: 'Our Project',
    tag: 'In my headspace!',
    body: 'With these, following the diagram that the tutors gave us through Tinkercad, we made the circuit! Which consistented of the ultrasonic sensor tracking the input, and very importantly PLUS loudly, the Piezzo buzzer producing sound as the output. Therefore, when objects get too close to the circuit, the ultrasonic sensor detects this and sends a singal through the circuit to the buzzer alarming everyone around us.',
    allImages: ['images/pproject.png', 'images/photo5.jpg']
  },
  {
    x: 180, y: 380,
    count: 3,
    images: ['images/tthumbnail.png'],
    title: 'Back off! Demo',
    tag: 'In my headspace!',
    body: 'As demonstrated here, the circuit can be put into very good use. When the user wears this design [including the headphones], and any strangers get too close, the buzzer will sound off stopping intruders and saving your personal bubble from being popped!',
    allImages: ['images/photo6.jpg', 'images/photo7.jpg'],
    videos: ['videos/headphones-video.mp4'] 
  },
  {
    x: 980, y: 130,
    count: 4,
    images: ['images/touch-diagram.png', 'images/photo9.jpg'],
    title: 'Our machine',
    tag: 'TTTouch!',
    body: 'Add your content description here.',
    allImages: ['images/photo8.jpg', 'images/photo9.jpg', 'images/photo10.jpg']
  },
  {
    x: 1200, y: 220,
    count: 5,
    images: ['images/click-thumbnail.png'],
    title: 'Sorry Click!',
    tag: 'TTTouch!',
    body: 'After all the experimenting with the vegetables, we were looking for another vessel to use. Unluckily for Click, I had our Click plushie with us! Click is a mascot for a computer science club that I am in and we volunteered to sacrifice him for the experiment...',
    allImages: ['images/click-thumbnail.png']
  },
  {
  x: 1000, y: 420,      
  count: 6,           
  images: ['images/lowcarrot-thumbnail.png', 'images/your-image2.jpg'], 
  title: 'Different Tones',
  tag: 'Week 6',
  body: 'Add your content description here.',
  allImages: ['images/your-image.jpg', 'images/your-image2.jpg', 'images/your-image3.jpg']
},
{
  x: 750, y: 320,       
  count: 7,           
  images: ['images/vege-thumbnail.png', 'images/your-image2.jpg'],  
  title: 'Veges Singing',
  tag: 'TTTouch!',
  body: '',
  allImages: ['images/your-image.jpg', 'images/your-image2.jpg', 'images/your-image3.jpg']
},
{
  x: 350, y: 650,       
  count: 8,           
  images: ['images/input&output.png', 'images/your-image2.jpg'],  
  title: 'Inputs and Outputs Grid',
  tag: 'Project Ideation',
  body: 'We did quick brainstorming with the inputs and outputs table; with this, we wrote down whatever inputs came to mind on the top row of the grid, for me this included: mouse, wind, movement, light, sound, pressure, pattern, and surface area. down the left-hand column, i wrote any outputs that came to mind, this included: particles move, something formed, machine starts up, sound, shadows reform, ball falls, open and fog. the activity then had us blindly put our figure somewhere on the grid and whatever square that lands on we took the input and output of that grid to form an idea. this activity was effective in helping form good brainstorm ideas where the input and output is easily identified and incorporated into the project.',
  allImages: ['images/input&output.png', 'images/your-image2.jpg', 'images/your-image3.jpg']
},
{
  x: 750, y: 320,       
  count: 9,           
  images: ['images/vege-thumbnail.png', 'images/your-image2.jpg'],  
  title: 'Veges Singing',
  tag: 'Project Ideation',
  body: 'With connecting different conductors to the different wires, the coding from Arduino IDE had programmed different outlets to have different tones, ending up with an output of different sounds depending on which vegetable you touch!',
  allImages: ['images/your-image.jpg', 'images/your-image2.jpg', 'images/your-image3.jpg']
},
];

const grid = document.querySelector('.map-grid');
const overlay = document.getElementById('overlay');
const overlayContent = document.getElementById('overlayContent');
const overlayClose = document.getElementById('overlayClose');

clusters.forEach(cluster => {
  const el = document.createElement('div');
  el.className = 'cluster';
  el.style.left = cluster.x + 'px';
  el.style.top = cluster.y + 'px';

  const stackHTML = cluster.images[1]
    ? `<div class="cluster-stack"><img src="${cluster.images[1]}" alt=""></div>`
    : '';

  el.innerHTML = `
    ${stackHTML}
    <div class="cluster-thumb">
      <img src="${cluster.images[0]}" alt="${cluster.title}">
    </div>
    <div class="cluster-count">${cluster.count}</div>
  `;

  el.addEventListener('click', () => openCluster(cluster));
  grid.appendChild(el);
});

function openCluster(cluster) {
  const imagesHTML = cluster.allImages
    ? cluster.allImages.map(src => `<img src="${src}" alt="">`).join('')
    : '';

  const videosHTML = cluster.videos
    ? cluster.videos.map(src => `
        <video controls>
          <source src="${src}" type="video/mp4">
        </video>`).join('')
    : '';

  overlayContent.innerHTML = `
    <h2>${cluster.title}</h2>
    <span class="overlay-tag">${cluster.tag}</span>
    <p>${cluster.body}</p>
    <div class="overlay-images">
      ${imagesHTML}
      ${videosHTML}
    </div>
  `;
  overlay.classList.add('open');
}

overlayClose.addEventListener('click', () => {
  overlay.classList.remove('open');
  overlay.querySelectorAll('video').forEach(v => v.pause());
});
overlay.addEventListener('click', e => {
  if (e.target === overlay) {
    overlay.classList.remove('open');
    overlay.querySelectorAll('video').forEach(v => v.pause());
  }
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