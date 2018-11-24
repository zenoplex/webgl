import { getWebGLContext, initShaders } from '../utils/cuonUtils';
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
uniform sampler2D uSampler;
varying vec2 vTexCoord;
void main() {
  gl_FragColor = texture2D(uSampler, vTexCoord);
}
`;

const loadTexture = (
  gl: WebGLRenderingContext,
  count: number,
  texture: WebGLTexture | null,
  uSampler: WebGLUniformLocation | null,
  image: HTMLImageElement
) => {
  // Flip the image's y axis
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  //  Enable the texture unit 0
  gl.activeTexture(gl.TEXTURE0);
  //  Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // Set the texture parameter
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  // Set the texture unit 0 to the sampler
  gl.uniform1i(uSampler, 0);
  // Clear
  gl.clear(gl.COLOR_BUFFER_BIT);
  // Draw rectangle
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, count);
};

const initTextures = (
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  count: number
) => {
  const texture = gl.createTexture();
  if (!texture) {
    console.error('Failed to create the texture object');
    return false;
  }

  const uSampler = gl.getUniformLocation(program, 'uSampler');
  if (!uSampler) {
    console.error('Failed to get the storage location of u_Sampler');
    return false;
  }
  const image = new Image();
  if (!image) {
    console.error('Failed to create image element');
  }
  image.onload = () => loadTexture(gl, count, texture, uSampler, image);
  image.src = textureJpg;
  return true;
};

const initVertexBuffers = (
  gl: WebGLRenderingContext,
  program: WebGLProgram
): number => {
  // prettier-ignore
  const verticies = new Float32Array([
    -0.5,  0.5, -0.3, 1.7,
    -0.5, -0.5, -0.3, -0.2,
     0.5,  0.5, 1.7, 1.7,
     0.5, -0.5, 1.7, -0.2,
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
