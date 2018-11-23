import { getWebGLContext, initShaders } from '../utils/cuonUtils';
import { Matrix4 } from '../utils/Matrix4';

const VSHADER_SOURCE = `
attribute vec4 aPosition;
uniform mat4 uModelMatrix;
void main() {
  gl_Position = uModelMatrix * aPosition;
}
`;

const FSHADER_SOURCE = `
void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;

const initVertexBuffers = (
  gl: WebGLRenderingContext,
  program: WebGLProgram
): number => {
  const verticies = new Float32Array([0, 0.3, -0.3, -0.3, 0.3, -0.3]);
  const vertexCount = 3;

  // Create a buffer object
  const vertextBuffer = gl.createBuffer();
  if (!vertextBuffer) {
    console.error('Failed to create buffer');
    return -1;
  }

  // Bind a Buffer Object to a Target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertextBuffer);
  // Write Data into a Buffer Object
  gl.bufferData(gl.ARRAY_BUFFER, verticies, gl.STATIC_DRAW);

  const aPosition = gl.getAttribLocation(program, 'aPosition');
  if (aPosition < 0) {
    console.error('Failed to get the storage locatoin of aPosition');
  }
  // Assign a buffer object to an attribute variable
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
  // Enable the assignment to an attribute variable
  gl.enableVertexAttribArray(aPosition);

  return vertexCount;
};

// Rotation in angle
const angle = 60.0;
const tx = 0.5;

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

  const matrix = new Matrix4();
  matrix.setRotate(angle, 0, 0, 1).translate(tx, 0, 0);
  // tslint:enable prettier
  const uMatrix = gl.getUniformLocation(program, 'uModelMatrix');
  gl.uniformMatrix4fv(uMatrix, false, matrix.elements);
  const n = initVertexBuffers(gl, program);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
};

main();
