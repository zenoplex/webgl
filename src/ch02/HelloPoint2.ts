import { getWebGLContext, initShaders } from '../utils/cuonUtils';

const VSHADER_SOURCE = `
attribute vec4 aPosition;
attribute float aPointSize;
void main() {
  gl_Position = aPosition;
  gl_PointSize = aPointSize;
}
`;

const FSHADER_SOURCE = `void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
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
  const aPointSize = gl.getAttribLocation(program, 'aPointSize');
  if (aPosition < 0) {
    console.error('Failed to get the storage locatoin of aPosition');
  }
  gl.vertexAttrib3f(aPosition, 0.0, 0.0, 0.0);
  // Below works too
  // gl.vertexAttrib3fv(aPosition, [0.0, 0.0, 0.0]);
  gl.vertexAttrib1f(aPointSize, 5.0);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, 1);
};

main();
