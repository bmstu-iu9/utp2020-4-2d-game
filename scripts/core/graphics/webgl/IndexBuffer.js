import Renderer from './Renderer.js';

export default class IndexBuffer {
	/**
	 * @param {Uint8Array | Uint16Array | Uint32Array} indices Индексы вершин.
	 */
	constructor(indices) {
		const gl = Renderer.gl;
		if (indices instanceof Uint8Array) {
			this.type = gl.UNSIGNED_BYTE;
		} else if (indices instanceof Uint16Array) {
			this.type = gl.UNSIGNED_SHORT;
		} else if (indices instanceof Uint32Array) {
			this.type = gl.UNSIGNED_INT;
		} else {
			throw new TypeError('invalid parameter "indices". Expected an instance of Uint8Array or Uint16Array or Uint32Array class.');
		}

		this.bufferId = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferId);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
	}

	/**
	 * Включает буфер индексов.
	 */
	bind() {
		if (this.bufferId == null) {
			throw new Error('index buffer is destroyed.');
		}

		const gl = Renderer.gl;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferId);
	}

	/**
	 * Отключает буфер индексов.
	 */
	unbind() {
		const gl = Renderer.gl;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, 0);
	}

	destroy() {
		if (this.bufferId == null) {
			return;
		}

		Renderer.gl.deleteBuffer(this.bufferId);
		this.bufferId = null;
	}
}
