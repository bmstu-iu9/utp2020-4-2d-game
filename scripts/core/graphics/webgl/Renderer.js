export default class Renderer {
	/**
	 * @type {WebGLRenderingContext}
	 */
	static gl;

	/**
	 * @param {HTMLCanvasElement} canvas
	 */
	static initialize(canvas) {
		this.gl = canvas.getContext('webgl');
		if (this.gl == null) {
			throw new Error('cannot use webgl.');
		}
	}

	static destroy() {
		this.gl = null;
	}
}
