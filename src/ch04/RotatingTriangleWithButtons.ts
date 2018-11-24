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

const draw = (
  gl: WebGLRenderingContext,
  count: number,
  currentAngle: number,
  model: Matrix4,
  uModel: WebGLUniformLocation | null
) => {
  model.setRotate(currentAngle, 0, 0, 1).translate(0.35, 0, 0);
  gl.uniformMatrix4fv(uModel, false, model.elements);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, count);
};

let ANGLE_STEP = 45.0;

const animate = (() => {
  // Rotation in angle

  let last = Date.now();

  return (angle: number) => {
    const now = Date.now();
    const elapsed = now - last;
    last = now;
    const newAngle = angle + (((ANGLE_STEP * elapsed) / 1000.0) % 360);
    return newAngle;
  };
})();

const up = () => {
  ANGLE_STEP += 50;
};

const down = () => {
  ANGLE_STEP -= 50;
};

export const main = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;
  document.body.append(canvas);

  const buttons = document.createElement('div');
  const upButton = document.createElement('button');
  upButton.textContent = 'up';
  upButton.addEventListener('click', up);
  buttons.append(upButton);

  const downButton = document.createElement('button');
  downButton.textContent = 'down';
  downButton.addEventListener('click', down);
  buttons.append(downButton);

  document.body.append(buttons);

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
  // tslint:enable prettier
  const uMatrix = gl.getUniformLocation(program, 'uModelMatrix');
  const n = initVertexBuffers(gl, program);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  let currentAngle = 0.0;

  const tick = () => {
    currentAngle = animate(currentAngle);
    draw(gl, n, currentAngle, matrix, uMatrix);
    requestAnimationFrame(tick);
  };

  tick();
};

main();
