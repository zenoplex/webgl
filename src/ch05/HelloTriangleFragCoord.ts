import { getWebGLContext, initShaders } from '../utils/cuonUtils';

const VSHADER_SOURCE = `
attribute vec4 aPosition;
void main() {
  gl_Position = aPosition;
}
`;

const FSHADER_SOURCE = `
precision mediump float;
uniform float uWidth;
uniform float uHeight;
void main() {
  gl_FragColor = vec4(gl_FragCoord.x / uWidth, 0.0, gl_FragCoord.y / uHeight, 1.0);
}`;

const initVertexBuffers = (
  gl: WebGLRenderingContext,
  program: WebGLProgram
): number => {
  const verticies = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
  const vertexCount = 3;

  // Create a buffer object
  const vertextBuffer = gl.createBuffer();
  if (!vertextBuffer) {
    console.error('Failed to create buffer');
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertextBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticies, gl.STATIC_DRAW);

  const aPosition = gl.getAttribLocation(program, 'aPosition');
  if (aPosition < 0) {
    console.error('Failed to get the storage locatoin of aPosition');
  }

  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aPosition);

  const uWidth = gl.getUniformLocation(program, 'uWidth');
  if (!uWidth) {
    console.error('Failed to get the storage location of uWidth');
    return -1;
  }

  const uHeight = gl.getUniformLocation(program, 'uHeight');
  if (!uHeight) {
    console.log('Failed to get the storage location of uHeight');
    return -1;
  }

  gl.uniform1f(uWidth, gl.drawingBufferWidth);
  gl.uniform1f(uHeight, gl.drawingBufferHeight);

  return vertexCount;
};

export const main = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;
  document.body.append(canvas);

  const gl = getWebGLContext(canvas);

  if (!gl) {
    console.error('Failed to get the rendering context for WebGL');
    return;
  }

  const program = initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  if (!program) {
    console.error('Failed to initialize shaders.');
    return;
  }

  const n = initVertexBuffers(gl, program);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
};

main();
