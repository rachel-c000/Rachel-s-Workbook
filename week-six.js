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