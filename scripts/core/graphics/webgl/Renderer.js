export default class Renderer {
	/**
	 * @type {WebGLRenderingContext}
	 */
	static gl;
	static maxTextureSlots;

	/**
	 * @param {HTMLCanvasElement} canvas
	 */
	static initialize(canvas) {
		Renderer.gl = canvas.getContext('webgl');
		if (Renderer.gl == null) {
			throw new Error('cannot use webgl.');
		}

		Renderer.maxTextureSlots = Renderer.gl.getParameter(Renderer.gl.MAX_TEXTURE_IMAGE_UNITS);
	}

	static destroy() {
		Renderer.gl = null;
	}
}
