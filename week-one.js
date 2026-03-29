const viewport = document.getElementById("viewport");
const canvas = document.getElementById("canvas");

let isDragging = false;
let startX, startY;
let offsetX = 0, offsetY = 0;

viewport.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.clientX - offsetX;
  startY = e.clientY - offsetY;
});

viewport.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  offsetX = e.clientX - startX;
  offsetY = e.clientY - startY;

  canvas.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
});

viewport.addEventListener("mouseup", () => {
  isDragging = false;
});

viewport.addEventListener("mouseleave", () => {
  isDragging = false;
});