const main = () => {
    const canvas = document.querySelector('#exmple');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
    }
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = `rgba(0, 0, 255, 1.0)`;
    ctx.fillRect(120, 10, 150, 150);
};
main();
//# sourceMappingURL=DrawRectangle.js.map