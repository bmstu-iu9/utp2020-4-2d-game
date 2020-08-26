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
		this.gl = canvas.getContext('webgl');
		if (this.gl == null) {
			throw new Error('cannot use webgl.');
		}

		this.maxTextureSlots = this.gl.getParameter(this.gl.MAX_TEXTURE_IMAGE_UNITS);
	}

	static destroy() {
		this.gl = null;
	}
}
