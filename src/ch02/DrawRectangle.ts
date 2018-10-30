export const main = () => {
  const canvas: HTMLCanvasElement | null = document.querySelector('#example');
  if (!canvas) {
    console.warn('Failed to retrieve the <canvas> element');
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.warn('Context is null');
    return;
  }
  ctx.fillStyle = `rgba(0, 0, 255, 1.0)`;
  ctx.fillRect(120, 10, 150, 150);
};

main();
