import { getWebGLContext, initShaders } from '../utils/cuonUtils';
import { Matrix4 } from '../utils/Matrix4';

const VSHADER_SOURCE = `
attribute vec4 aPosition;
attribute vec4 aColor;
uniform mat4 uProjectionMatrix;
varying vec4 vColor;

void main() {
  gl_Position = uProjectionMatrix * aPosition;
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
     0.0,  0.6, -0.4, 0.4, 1.0, 0.4, // The back green one
    -0.5, -0.4, -0.4, 0.4, 1.0, 0.4,
     0.5, -0.4, -0.4, 1.0, 0.4, 0.4, 
     0.5,  0.4, -0.2, 1.0, 0.4, 0.4, // The middle yellow one
    -0.5,  0.4, -0.2, 1.0, 1.0, 0.4,
     0.0, -0.6, -0.2, 1.0, 1.0, 0.4, 
     0.0,  0.5,  0.0, 0.4, 0.4, 1.0, // The front blue one 
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

let near = 0;
let far = 0.5;
const speed = 0.01;

const draw = (
  gl: WebGLRenderingContext,
  count: number,
  uProjectionMatrix: WebGLUniformLocation,
  projectionMatrix: Matrix4,
  output: HTMLElement
) => {
  projectionMatrix.setOrtho(-1, 1, -1, 1, near, far);
  gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix.elements);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, count);
  
  output.innerHTML = `near: ${Math.round(near * 100) / 100}, far: ${Math.round(
    far * 100
  ) / 100}`;
};

const main = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;
  document.body.append(canvas);

  const p = document.createElement('p');
  p.id = 'p';
  document.body.append(p);

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

  const uProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
  if (!uProjectionMatrix) {
    console.error('Failed to get the storage location of uProjectionMatrix');
    return;
  }

  const projectionMatrix = new Matrix4();

  const onKeyDown = (e: KeyboardEvent) => {
    const { keyCode } = e;
    switch (keyCode) {
      case 39:
        near += speed;
        break;
      case 37:
        near -= speed;
        break;
      case 38:
        far += speed;
        break;
      case 40:
        far -= speed;
        break;
      default:
        return;
    }
    draw(gl, n, uProjectionMatrix, projectionMatrix, p);
  };
  document.addEventListener('keydown', onKeyDown);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  draw(gl, n, uProjectionMatrix, projectionMatrix, p);
};

main();
