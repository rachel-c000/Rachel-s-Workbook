 const folders = Array.from(document.querySelectorAll('.folder'));
  const GAP = 52;
 
  function layout() {
    folders.forEach((f, i) => {
      f.style.top = (i * GAP) + 'px';
      f.style.zIndex = i + 1;
    });
  }
 
  layout();
 
  folders.forEach(folder => {
    folder.addEventListener('click', () => {
      const isLifted = folder.classList.contains('lifted');
      folders.forEach(f => f.classList.remove('lifted'));
      if (!isLifted) folder.classList.add('lifted');
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
