import { nodeEnv } from '../env';
import { WebGLUtils } from './webGLUtils';

// cuon-utils.js (c) 2012 kanda and matsuda
/**
 * Create a program object and make current
 * @param gl GL context
 * @param vshader a vertex shader program (string)
 * @param fshader a fragment shader program (string)
 * @return WebGLProgram or null
 */
export const initShaders = (
  gl: WebGLRenderingContext,
  vshader: string,
  fshader: string
): WebGLProgram | null => {
  const program = createProgram(gl, vshader, fshader);
  if (!program) {
    console.log('Failed to create program');
    return false;
  }

  gl.useProgram(program);
  return program;
};

/**
 * Create the linked program object
 * @param gl GL context
 * @param vshader a vertex shader program (string)
 * @param fshader a fragment shader program (string)
 * @return created program object, or null if the creation has failed
 */
export const createProgram = (
  gl: WebGLRenderingContext,
  vshader: string,
  fshader: string
) => {
  // Create shader object
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
  if (!vertexShader || !fragmentShader) {
    return null;
  }

  // Create a program object
  const program = gl.createProgram();
  if (!program) {
    return null;
  }

  // Attach the shader objects
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // Link the program object
  gl.linkProgram(program);

  // Check the result of linking
  const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    const error = gl.getProgramInfoLog(program);
    console.log('Failed to link program: ' + error);
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return null;
  }
  return program;
};

/**
 * Create a shader object
 * @param gl GL context
 * @param type the type of the shader object to be created
 * @param source shader program (string)
 * @return created shader object, or null if the creation has failed.
 */
export const loadShader = (
  gl: WebGLRenderingContext,
  type: number,
  source: string
) => {
  // Create shader object
  const shader = gl.createShader(type);
  if (shader == null) {
    console.log('unable to create shader');
    return null;
  }

  // Set the shader program
  gl.shaderSource(shader, source);

  // Compile the shader
  gl.compileShader(shader);

  // Check the result of compilation
  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    const error = gl.getShaderInfoLog(shader);
    console.log('Failed to compile shader: ' + error);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
};

/**
 * Initialize and get the rendering for WebGL
 * @param canvas <cavnas> element
 * @param debug flag to initialize the context for debugging
 * @return the rendering context for WebGL
 */
export const getWebGLContext = (
  canvas: HTMLCanvasElement
): WebGLRenderingContext | null => {
  // Get the rendering context for WebGL
  const gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    return null;
  }

  // if opt_debug is explicitly false, create the context for debugging
  return nodeEnv === 'development' ? WebGLDebugUtils.makeDebugContext(gl) : gl;
};
