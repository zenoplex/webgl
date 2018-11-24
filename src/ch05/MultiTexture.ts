import { getWebGLContext, initShaders } from '../utils/cuonUtils';
import * as circleGif from './circle.gif';
import * as textureJpg from './texture.jpg';

const VSHADER_SOURCE = `
attribute vec4 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;
void main() {
  gl_Position = aPosition;
  vTexCoord = aTexCoord;
}
`;

const FSHADER_SOURCE = `
precision mediump float;
uniform sampler2D uSampler0;
uniform sampler2D uSampler1;
varying vec2 vTexCoord;
void main() {
  vec4 color0 = texture2D(uSampler0, vTexCoord);
  vec4 color1 = texture2D(uSampler1, vTexCoord);
  gl_FragColor = color0 * color1;
}
`;

let gTexUnit0 = false;
let gTexUnit1 = false;

const loadTexture = (
  gl: WebGLRenderingContext,
  count: number,
  texture: WebGLTexture | null,
  uSampler: WebGLUniformLocation | null,
  image: HTMLImageElement,
  texUnit: number
) => {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  if (texUnit === 0) {
    gl.activeTexture(gl.TEXTURE0);
    gTexUnit0 = true;
  } else {
    gl.activeTexture(gl.TEXTURE1);
    gTexUnit1 = true;
  }

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(uSampler, texUnit);
  gl.clear(gl.COLOR_BUFFER_BIT);

  if (gTexUnit0 && gTexUnit1) {
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, count);
  }
};

const initTextures = (
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  count: number
) => {
  const texture0 = gl.createTexture();
  if (!texture0) {
    console.error('Failed to create the texture object');
    return false;
  }
  const texture1 = gl.createTexture();
  if (!texture1) {
    console.error('Failed to create the texture object');
    return false;
  }

  const uSampler0 = gl.getUniformLocation(program, 'uSampler0');
  if (!uSampler0) {
    console.error('Failed to get the storage location of u_Sampler0');
    return false;
  }

  const uSampler1 = gl.getUniformLocation(program, 'uSampler1');
  if (!uSampler1) {
    console.error('Failed to get the storage location of u_Sampler1');
    return false;
  }

  const image0 = new Image();
  if (!image0) {
    console.error('Failed to create image element');
  }
  image0.onload = () => loadTexture(gl, count, texture0, uSampler0, image0, 0);
  image0.src = textureJpg;

  const image1 = new Image();
  if (!image1) {
    console.error('Failed to create image element');
  }
  image1.onload = () => loadTexture(gl, count, texture1, uSampler1, image1, 1);
  image1.src = circleGif;

  return true;
};

const initVertexBuffers = (
  gl: WebGLRenderingContext,
  program: WebGLProgram
): number => {
  // prettier-ignore
  const verticies = new Float32Array([
    -0.5,  0.5, 0.0, 1.0,
    -0.5, -0.5, 0.0, 0.0,
     0.5,  0.5, 1.0, 1.0,
     0.5, -0.5, 1.0, 0.0,
  ]);
  const vertexCount = 4;
  const FSIZE = verticies.BYTES_PER_ELEMENT;

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
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, FSIZE * 4, 0);
  gl.enableVertexAttribArray(aPosition);

  const aTexCoord = gl.getAttribLocation(program, 'aTexCoord');
  if (aTexCoord < 0) {
    console.error('Failed to get the storage location of aTexCoord');
  }
  gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
  gl.enableVertexAttribArray(aTexCoord);

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
  if (n < 0) {
    console.error('Failed to set the vertex information');
    return;
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  if (!initTextures(gl, program, n)) {
    console.error('Failed to intialize the texture.');
    return;
  }
};

main();
