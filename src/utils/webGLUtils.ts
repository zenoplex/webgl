const makeFailHtml = (msg: string) => {
  return (
    '' +
    '<div style="margin: auto; width:500px;z-index:10000;margin-top:20em;text-align:center;">' +
    msg +
    '</div>'
  );
  return (
    '' +
    '<table style="background-color: #8CE; width: 100%; height: 100%;"><tr>' +
    '<td align="center">' +
    '<div style="display: table-cell; vertical-align: middle;">' +
    '<div style="">' +
    msg +
    '</div>' +
    '</div>' +
    '</td></tr></table>'
  );
};

const GET_A_WEBGL_BROWSER = `This page requires a browser that supports WebGL.<br/>
<a href="http://get.webgl.org">Click here to upgrade your browser.</a>`;

const OTHER_PROBLEM = `It doesn't appear your computer can support WebGL.<br/>
  <a href="http://get.webgl.org">Click here for more information.</a>`;

/**
 * Creates a webgl context.
 * @param {!Canvas} canvas The canvas tag to get context
 *     from. If one is not passed in one will be created.
 * @return {!WebGLContext} The created context.
 */
const create3DContext = (
  canvas: HTMLCanvasElement,
  attributes?: object
): WebGLRenderingContext | CanvasRenderingContext2D | null | void => {
  const names = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'];

  let context;
  for (const item of names) {
    context = canvas.getContext(item, attributes);
    if (context) {
      break;
    }
  }
  return context;
};

const handleCreationError = (msg: string) => {
  const container = document.getElementsByTagName('body')[0];
  // var container = canvas.parentNode;
  if (container) {
    // @ts-ignore
    let str = window.WebGLRenderingContext
      ? OTHER_PROBLEM
      : GET_A_WEBGL_BROWSER;

    if (msg) {
      str += '<br/><br/>Status: ' + msg;
    }
    container.innerHTML = makeFailHtml(str);
  }
};

/**
 *
 * @param canvas: HTMLCanvasElement
 * @param attributes?: WebGLContextCreationAttributes
 * @param onError?: string => void
 */
const setupWebGL = (
  canvas: HTMLCanvasElement,
  attributes?: object,
  onError: (msg: string) => void = handleCreationError
) => {
  if (canvas.addEventListener) {
    canvas.addEventListener(
      'webglcontextcreationerror',
      // @ts-ignore
      (e: WebGLContextEvent) => {
        onError(e.statusMessage);
      },
      false
    );
  }
  const context = create3DContext(canvas, attributes);
  if (!context) {
    // @ts-ignore
    if (!window.WebGLRenderingContext) {
      onError('');
    } else {
      onError('');
    }
  }

  return context;
};

export const WebGLUtils = {
  create3DContext,
  setupWebGL
};
