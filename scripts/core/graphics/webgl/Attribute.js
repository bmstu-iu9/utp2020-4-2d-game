import Renderer from './Renderer.js';

export default class Attribute {
	/**
	 * @param {string}  name   Название атрибута.
	 * @param {number}  size   Размер типа.
	 * @param {number}  type   Тип атрибута.
	 * @param {number}  offset Смещение атрибута в буфере.
	 */
	constructor(name, type, offset) {
		if (typeof name !== 'string') {
			throw new TypeError('invalid parameter "name". Expected a string.');
		}

		if (typeof type !== 'number') {
			throw new TypeError('invalid parameter "type". Expected a number.');
		}

		if (typeof offset !== 'number') {
			throw new TypeError('invalid parameter "offset". Expected a number.');
		}

		this.name = name;
		this.size = Attribute.TypeToSize(type);
		this.type = type;
		this.webglType = Attribute.TypeToWebGLType(type);
		this.offset = offset;
	}

	static float = 0;
	static vector2 = 1;
	static vector3 = 2;
	static vector4 = 3;
	static matrix2x2 = 4;
	static matrix3x3 = 5;

	/**
	 * @param {number} type Тип атрибута.
	 * 
	 * @return {number} Возвращает WebGl тип, который относится к передаваемому типу.
	 */
	static TypeToWebGLType(type) {
		if (typeof type !== 'number') {
			throw new TypeError('invalid parameter "type". Expected a number.');
		}

		switch (type) {
			case Attribute.float:
			case Attribute.vector2:
			case Attribute.vector3:
			case Attribute.vector4:
			case Attribute.matrix2x2:
			case Attribute.matrix3x3:
				return Renderer.gl.FLOAT;
		}
		throw new Error(`undefined type: ${type}.`);
	}

	/**
	 * @param {number} type Тип атрибута.
	 * 
	 * @return {number} Возвращает размер типа.
	 */
	static TypeToSize(type) {
		if (typeof type !== 'number') {
			throw new TypeError('invalid parameter "type". Expected a number.');
		}

		switch (type) {
			case Attribute.float:
				return 1;
			case Attribute.vector2:
				return 2;
			case Attribute.vector3:
				return 3;
			case Attribute.vector4:
				return 4;
			case Attribute.matrix2x2:
				return 2;
			case Attribute.matrix3x3:
				return 3;
		}
		throw new Error(`undefined type: ${type}.`);
	}

	/**
	 * @param {number} type Тип атрибута.
	 * 
	 * @return {number} Возвращает размер типа в байтах.
	 */
	static TypeToByteSize(type) {
		if (typeof type !== 'number') {
			throw new TypeError('invalid parameter "type". Expected a number.');
		}

		switch (type) {
			case Attribute.float:
				return 4;
			case Attribute.vector2:
				return 8;
			case Attribute.vector3:
				return 12;
			case Attribute.vector4:
				return 16;
			case Attribute.matrix2x2:
				return 16;
			case Attribute.matrix3x3:
				return 36;
		}
		throw new Error(`undefined type: ${type}.`);
	}
}
