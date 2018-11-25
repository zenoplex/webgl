import { getWebGLContext, initShaders } from '../utils/cuonUtils';
import { Matrix4 } from '../utils/Matrix4';

const VSHADER_SOURCE = `
attribute vec4 aPosition;
attribute vec4 aColor;
uniform mat4 uModelViewMatrix;
varying vec4 vColor;

void main() {
  gl_Position = uModelViewMatrix * aPosition;
  vColor = aColor;
}
`;

const FSHADER_SOURCE = `
#ifdef GL_ES
precision mediump float;
#endif
varying vec4 vColor;
void main() {
  gl_FragColor = vColor;
}
`;

const initVertexBuffers = (
  gl: WebGLRenderingContext,
  program: WebGLProgram
) => {
  // prettier-ignore
  const verticies = new Float32Array([
    // triagnle cordinate with color
     0.0,  0.5, -0.4, 0.4, 1.0, 0.4,
    -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
     0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

     0.5,  0.4, -0.2, 1.0, 0.4, 0.4,
    -0.5,  0.4, -0.2, 1.0, 1.0, 0.4,
     0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

     0.0,  0.5,  0.0, 0.4, 0.4, 1.0,
    -0.5, -0.5,  0.0, 0.4, 0.4, 1.0,
     0.5, -0.5,  0.0, 1.0, 0.4, 0.4,
  ])
  const vertexCount = 9;
  const FSIZE = verticies.BYTES_PER_ELEMENT;

  const vertextBuffer = gl.createBuffer();
  if (!vertextBuffer) {
    console.error('Failed to create buffer');
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertextBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticies, gl.STATIC_DRAW);

  const aPosition = gl.getAttribLocation(program, 'aPosition');
  if (aPosition < 0) {
    console.error('Failed to get the storage location of aPosition');
  }
  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(aPosition);

  const aColor = gl.getAttribLocation(program, 'aColor');
  if (aColor < 0) {
    console.error('Failed to get the storage location of aColor');
  }
  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(aColor);

  return vertexCount;
};

const main = () => {
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
  if (n < 0) {
    console.error('Failed to set the vertex information');
    return;
  }

  const uModelViewMatrix = gl.getUniformLocation(program, 'uModelViewMatrix');
  if (!uModelViewMatrix) {
    console.error('Failed to get the storage location of uModelViewMatrix');
    return;
  }

  const modelViewMatrix = new Matrix4();
  modelViewMatrix
    .setLookAt(0.2, 0.25, 0.25, 0, 0, 0, 0, 1, 0)
    .rotate(-10, 0, 0, 1);

  gl.uniformMatrix4fv(uModelViewMatrix, false, modelViewMatrix.elements);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLES, 0, n);
};

main();
