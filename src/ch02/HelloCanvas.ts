const fn = () => {
  const canvas = document.querySelector('#example');

  const gl = getWebGLContext(canvas, true);
  if (!gl) {
    console.error('Failed to get the rendering context for WebGL');
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
};

fn();
