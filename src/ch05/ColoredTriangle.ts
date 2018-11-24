import { getWebGLContext, initShaders } from '../utils/cuonUtils';
import { Matrix4 } from '../utils/Matrix4';

const VSHADER_SOURCE = `
attribute vec4 aPosition;
attribute vec4 aColor;
varying vec4 vColor;
void main() {
  gl_Position = aPosition;
  vColor = aColor;
}
`;

const FSHADER_SOURCE = `
precision mediump float; // @see https://stackoverflow.com/questions/27058064/why-do-i-need-to-define-a-precision-value-in-webgl-shaders
varying vec4 vColor;
void main() {
  gl_FragColor = vColor;
}`;

const initVertexBuffers = (
  gl: WebGLRenderingContext,
  program: WebGLProgram
): number => {
  // prettier-ignore
  const verticies = new Float32Array([
     0.0,  0.5, 1.0, 0.0, 0.0,
    -0.5, -0.5, 0.0, 1.0, 0.0,
     0.5, -0.5, 0.0, 0.0, 1.0,
  ]);
  const vertexCount = 3;

  // Create a buffer object
  const vertextBuffer = gl.createBuffer();
  if (!vertextBuffer) {
    console.error('Failed to create buffer');
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertextBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticies, gl.STATIC_DRAW);

  const FSIZE = verticies.BYTES_PER_ELEMENT;
  console.log('Element byte size', FSIZE);

  const aPosition = gl.getAttribLocation(program, 'aPosition');
  if (aPosition < 0) {
    console.error('Failed to get the storage locatoin of aPosition');
  }

  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, FSIZE * 5, 0);
  gl.enableVertexAttribArray(aPosition);

  const aColor = gl.getAttribLocation(program, 'aColor');
  if (aColor < 0) {
    console.error('Failed to get the storage locatoin of aPointSize');
  }

  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
  gl.enableVertexAttribArray(aColor);

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
