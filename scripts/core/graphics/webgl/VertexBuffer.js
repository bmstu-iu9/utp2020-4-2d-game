import Renderer from './Renderer.js';
import Attributes from './Attributes.js';
import Attribute from './Attribute.js';

export default class VertexBuffer {
	/**
	 * @param {number}     size       Размер буфера.
	 * @param {Attributes} attributes Атрибуты буфера.
	 */
	constructor(size, attributes) {
		if (typeof size !== 'number') {
			throw new TypeError('invalid parameter "size". Expected a number.');
		}

		if (size < 1) {
			throw new Error('invalid parameter "size". Value must be greater than 0.');
		}

		if (!(attributes instanceof Attributes)) {
			throw new TypeError('invalid parameter "attributes". Expected an instance of Attributes class.');
		}

		if (attributes.storage.length === 0) {
			throw new Error('invalid parameter "attributes". Attributes count must be greater than 0.');
		}

		const gl = Renderer.gl;
		this.bufferId = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferId);
		gl.bufferData(gl.ARRAY_BUFFER, size * attributes.stride, gl.DYNAMIC_DRAW);
		this.attributes = attributes;
	}

	throwIfDestroyed() {
		if (this.bufferId == null) {
			throw new Error('vertex buffer is destroyed.');
		}
	}

	/**
	 * Передает данные в буфер.
	 * 
	 * @param {Float32Array} data Данные, которые надо передать.
	 */
	setData(data) {
		this.throwIfDestroyed();
		if (!(data instanceof Float32Array)) {
			throw new TypeError('invalid parameter "data". Expected an instance of Float32Array class.');
		}

		const gl = Renderer.gl;
		gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferId);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
	}

	/**
	 * Включает буфер вершин.
	 */
	bind() {
		this.throwIfDestroyed();
		const gl = Renderer.gl;
		const program = gl.getParameter(gl.CURRENT_PROGRAM);
		if (program == null) {
			return;
		}

		gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferId);
		const floatByteSize = 4;
		for (let i = 0; i < this.attributes.storage.length; i++) {
			const attribute = this.attributes.storage[i];
			const location = gl.getAttribLocation(program, attribute.name);
			if (location === -1) {
				continue;
			}

			gl.enableVertexAttribArray(location);
			switch (attribute.type) {
				case Attribute.float:
				case Attribute.vector2:
				case Attribute.vector3:
				case Attribute.vector4:
					gl.vertexAttribPointer(
						location,
						attribute.size,
						attribute.webglType,
						false,
						this.attributes.stride,
						attribute.offset,
					);
					break;
				case Attribute.matrix2x2:
				case Attribute.matrix3x3:
					for (let j = 0; j < attribute.size; j++) {
						gl.vertexAttribPointer(
							location + j,
							attribute.size,
							attribute.webglType,
							false,
							this.attributes.stride,
							attribute.offset + attribute.size * j * floatByteSize,
						);
					}
					break;
			}
		}
	}

	/**
	 * Выключает буфер вершин.
	 */
	unbind() {
		const gl = Renderer.gl;
		gl.bindBuffer(gl.ARRAY_BUFFER, 0);
	}

	destroy() {
		if (this.bufferId == null) {
			return;
		}

		Renderer.gl.deleteBuffer(this.bufferId);
		this.bufferId = null;
	}
}
