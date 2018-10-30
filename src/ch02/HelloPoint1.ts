const VSHADER_SOURCE = `void main() {
  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
  gl_PointSize = 10.0;
}
`;

const FSHADER_SOURCE = `
void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;

export const main = () => {
  const canvas: HTMLCanvasElement | null = document.querySelector('#example');
  const gl = getWebGLContext(canvas);

  if (!gl) {
    console.error('Failed to get the rendering context for WebGL');
    return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.error('Failed to initialize shaders.');
    return;
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, 1);
};

main();
