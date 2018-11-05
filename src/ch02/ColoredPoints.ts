import { getWebGLContext, initShaders } from '../utils/cuonUtils';

const VSHADER_SOURCE = `
attribute vec4 aPosition;
attribute float aPointSize;
void main() {
  gl_Position = aPosition;
  gl_PointSize = aPointSize;
}
`;

const FSHADER_SOURCE = `
precision mediump float;
uniform vec4 uFragColor;
void main() {
  gl_FragColor = uFragColor;
}`;

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

  const aPosition = gl.getAttribLocation(program, 'aPosition');
  if (aPosition < 0) {
    console.error('Failed to get the storage locatoin of aPosition');
  }
  const uFragColor = gl.getUniformLocation(program, 'uFragColor');
  if (!uFragColor) {
    console.error('Failed to get uFragColor variable');
  }
  const aPointSize = gl.getAttribLocation(program, 'aPointSize');

  gl.vertexAttrib3f(aPosition, 0.0, 0.0, 0.0);
  // Below works too
  // gl.vertexAttrib3fv(aPosition, [0.0, 0.0, 0.0]);
  gl.vertexAttrib1f(aPointSize, 5.0);

  const gPoints: Array<{ x: number; y: number }> = [];
  const gColors: Array<[number, number, number, number]> = [];

  canvas.addEventListener('mousedown', e => {
    const target = e.currentTarget as HTMLCanvasElement;

    const rect = target.getBoundingClientRect();

    const x = (e.clientX - rect.left - target.width / 2) / (target.width / 2);
    const y =
      (target.height / 2 - (e.clientY - rect.top)) / (target.height / 2);

    if (x >= 0.0 && y >= 0.0) {
      gColors.push([1.0, 0.0, 0.0, 1.0]);
    } else if (x < 0.0 && y < 0.0) {
      gColors.push([0.0, 1.0, 0.0, 1.0]);
    } else {
      gColors.push([1.0, 1.0, 1.0, 1.0]);
    }

    gPoints.push({ x, y });
    gl.clear(gl.COLOR_BUFFER_BIT);

    gPoints.forEach((item, index) => {
      gl.vertexAttrib3f(aPosition, item.x, item.y, 0.0);
      gl.uniform4f(uFragColor, ...gColors[index]);
      gl.drawArrays(gl.POINTS, 0, 1);
    });
  });

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
};

main();
