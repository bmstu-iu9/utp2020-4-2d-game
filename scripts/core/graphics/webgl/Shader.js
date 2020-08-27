import Renderer from './Renderer.js';
import Matrix2x2 from '../../mathematics/Matrix2x2.js';
import Matrix3x3 from '../../mathematics/Matrix3x3.js';
import Resources from '../../Resources.js';

class ShaderError extends Error {
	constructor(shaderName, message) {
		super(`in shader with name "${shaderName}". ${message}`);
		this.name = 'ShaderError';
		this.shaderName = shaderName;
	}
}

const createShader = (name, gl, type, source) => {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		const info = gl.getShaderInfoLog(shader);
		gl.deleteShader(shader);
		throw new ShaderError(name, info);
	}

	return shader;
}

export default class Shader {
	/**
	 * @param {Resources} resources      Место для хранения данного шейдера.
	 * @param {string}    name           Название шейдера.
	 * @param {string}    vertexSource   Код вершинного шейдера.
	 * @param {string}    fragmentSource Код фрагментного шейдера.
	 */
	constructor(resources, name, vertexSource, fragmentSource) {
		if (!(resources instanceof Resources)) {
			throw new TypeError('invalid parameter "resources". Expected an instance of Resources class.');
		}

		if (typeof name !== 'string') {
			throw new TypeError('invalid parameter "name". Expected a string.');
		}

		if (name.trim() === '') {
			throw new TypeError('invalid parameter "name". Expected a non-empty string.');
		}

		if (typeof vertexSource !== 'string') {
			throw new TypeError('invalid parameter "vertexSource". Expected a string.');
		}
		
		if (typeof fragmentSource !== 'string') {
			throw new TypeError('invalid parameter "fragmentSource". Expected a string.');
		}

		const gl = Renderer.gl;
		const vertexShader = createShader(name, gl, gl.VERTEX_SHADER, vertexSource);
		let fragmentShader = null;
		try {
			fragmentShader = createShader(name, gl, gl.FRAGMENT_SHADER, fragmentSource);
		} catch(error) {
			gl.deleteShader(vertexShader);
			throw error;
		}

		this.programId = gl.createProgram();
		gl.attachShader(this.programId, vertexShader);
		gl.attachShader(this.programId, fragmentShader);
		gl.linkProgram(this.programId);
		if (!gl.getProgramParameter(this.programId, gl.LINK_STATUS)) {
			const info = gl.getProgramInfoLog(this.programId);
			gl.deleteProgram(this.programId);
			gl.deleteShader(vertexShader);
			gl.deleteShader(fragmentShader);
			throw new ShaderError(name, `Cannot link vertex and fragment shader. Info: ${info}`);
		}

		gl.deleteShader(vertexShader);
		gl.deleteShader(fragmentShader);

		resources.objectsToDestroy.add(this);
		this.resources = resources;
		this.name = name;
	}

	throwIfDestroyed() {
		if (this.programId == null) {
			throw new Error('shader is destroyed.');
		}
	}

	/**
	 * Включает шейдер.
	 */
	bind() {
		this.throwIfDestroyed();
		Renderer.gl.useProgram(this.programId);
	}

	/**
	 * Выключает шейдер.
	 */
	unbind() {
		Renderer.gl.useProgram(0);
	}

	/**
	 * Передает целое число в шейдер.
	 * 
	 * @param {string} name Название переменной.
	 * @param {number} x    Значение, которое надо передать.
	 */
	setInt(name, x) {
		this.throwIfDestroyed();
		if (typeof name !== 'string') {
			throw new TypeError('invalid parameter "name". Expected a string.');
		}

		if (!Number.isInteger(x)) {
			throw new TypeError('invalid parameter "x". Expected a number.');
		}

		const gl = Renderer.gl;
		const location = gl.getUniformLocation(this.programId, name);
		gl.uniform1i(location, x);
	}

	/**
	 * Передает массив целых чисел в шейдер.
	 * 
	 * @param {string}   name   Название переменной.
	 * @param {values[]} values Массив значений, который надо передать.
	 */
	setIntArray(name, values) {
		this.throwIfDestroyed();
		if (typeof name !== 'string') {
			throw new TypeError('invalid parameter "name". Expected a string.');
		}

		if (!Array.isArray(values)) {
			throw new TypeError('invalid parameter "values". Expected an array.');
		}

		for (let i = 0; i < values.length; i++) {
			if (!Number.isInteger(values[i])) {
				throw new TypeError(`invalid array element. Expected an integer.`);
			}
		}

		const gl = Renderer.gl;
		const location = gl.getUniformLocation(this.programId, name);
		gl.uniform1iv(location, values);
	}

	/**
	 * Передает число в шейдер.
	 * 
	 * @param {string} name Название переменной.
	 * @param {number} x    Значение, которое надо передать.
	 */
	setFloat(name, x) {
		this.throwIfDestroyed();
		if (typeof name !== 'string') {
			throw new TypeError('invalid parameter "name". Expected a string.');
		}

		if (typeof x !== 'number') {
			throw new TypeError('invalid parameter "x". Expected a number.');
		}

		const gl = Renderer.gl;
		const location = gl.getUniformLocation(this.programId, name);
		gl.uniform1f(location, x);
	}

	/**
	 * Передает вектор из двух чисел в шейдер.
	 * 
	 * @param {string} name Название переменной.
	 * @param {number} x    Значение x вектора.
	 * @param {number} y    Значение y вектора.
	 */
	setFloat2(name, x, y) {
		this.throwIfDestroyed();
		if (typeof name !== 'string') {
			throw new TypeError('invalid parameter "name". Expected a string.');
		}

		const assert = (name, value) => {
			if (typeof value !== 'number') {
				throw new TypeError(`invalid parameter "${name}". Expected a number.`);
			}
			return value;
		}

		const gl = Renderer.gl;
		const location = gl.getUniformLocation(this.programId, name);
		gl.uniform2f(location, assert('x', x), assert('y', y));
	}

	/**
	 * Передает вектор из трех чисел в шейдер.
	 * 
	 * @param {string} name Название переменной.
	 * @param {number} x    Значение x вектора.
	 * @param {number} y    Значение y вектора.
	 * @param {number} z    Значение z вектора.
	 */
	setFloat3(name, x, y, z) {
		this.throwIfDestroyed();
		if (typeof name !== 'string') {
			throw new TypeError('invalid parameter "name". Expected a string.');
		}

		const assert = (name, value) => {
			if (typeof value !== 'number') {
				throw new TypeError(`invalid parameter "${name}". Expected a number.`);
			}
			return value;
		}

		const gl = Renderer.gl;
		const location = gl.getUniformLocation(this.programId, name);
		gl.uniform3f(location, assert('x', x), assert('y', y), assert('z', z));
	}

	/**
	 * Передает вектор из четырех чисел в шейдер.
	 * 
	 * @param {string} name Название переменной.
	 * @param {number} x    Значение x вектора.
	 * @param {number} y    Значение y вектора.
	 * @param {number} z    Значение z вектора.
	 * @param {number} w    Значение w вектора.
	 */
	setFloat4(name, x, y, z, w) {
		this.throwIfDestroyed();
		if (typeof name !== 'string') {
			throw new TypeError('invalid parameter "name". Expected a string.');
		}

		const assert = (name, value) => {
			if (typeof value !== 'number') {
				throw new TypeError(`invalid parameter "${name}". Expected a number.`);
			}
			return value;
		}

		const gl = Renderer.gl;
		const location = gl.getUniformLocation(this.programId, name);
		gl.uniform4f(location, assert('x', x), assert('y', y), assert('z', z), assert('w', w));
	}

	/**
	 * Передает матрицу 2 на 2 в шейдер.
	 * 
	 * @param {string}    name      Название переменной.
	 * @param {Matrix2x2} matrix2x2 Матрица, которую надо передать.
	 */
	setMatrix2x2(name, matrix2x2) {
		this.throwIfDestroyed();
		if (typeof name !== 'string') {
			throw new TypeError('invalid parameter "name". Expected a string.');
		}

		if (!(matrix2x2 instanceof Matrix2x2)) {
			throw new TypeError('invalid parameter "matrix2x2". Expected an instance of Matrix2x2 class.');
		}

		const gl = Renderer.gl;
		const location = gl.getUniformLocation(this.programId, name);
		gl.uniformMatrix2fv(location, false, matrix2x2);
	}

	/**
	 * Передает матрицу 3 на 3 в шейдер.
	 * 
	 * @param {string}    name      Название переменной.
	 * @param {Matrix3x3} matrix3x3 Матрица, которую надо передать.
	 */
	setMatrix3x3(name, matrix3x3) {
		this.throwIfDestroyed();
		if (typeof name !== 'string') {
			throw new TypeError('invalid parameter "name". Expected a string.');
		}

		if (!(matrix3x3 instanceof Matrix3x3)) {
			throw new TypeError('invalid parameter "matrix3x3". Expected an instance of Matrix3x3 class.');
		}

		const gl = Renderer.gl;
		const location = gl.getUniformLocation(this.programId, name);
		gl.uniformMatrix3fv(location, false, matrix3x3);
	}

	destroy() {
		if (this.programId == null) {
			return;
		}

		Renderer.gl.deleteProgram(this.programId);
		this.programId = null;
		this.resources.objectsToDestroy.delete(this);
		this.resources = null;
	}

	/**
	 * Создает шейдер из кода, который представлен текстом.
	 * 
	 * @param {Resources} resources Место для хранения данного шейдера.
	 * @param {string}    name      Название шейдера.
	 * @param {string}    source    Код шейдера.
	 */
	static fromText(resources, name, source) {
		if (!(resources instanceof Resources)) {
			throw new TypeError('invalid parameter "resources". Expected an instance of Resources class.');
		}

		if (typeof name !== 'string') {
			throw new TypeError('invalid parameter "name". Expected a string.');
		}

		if (name.trim() === '') {
			throw new TypeError('invalid parameter "name". Expected a non-empty string.');
		}

		if (typeof source !== 'string') {
			throw new TypeError('invalid parameter "source". Expected a string.');
		}

		const states = Object.freeze({
			none: 0,
			vertex: 1,
			fragment: 2,
		});
		let state = states.none;
		let usedStates = 0;
		let vertexSource = '';
		let fragmentSource = '';
		const lines = source.split(/\r\n|\n|\r/);
		for (let i = 0; i < lines.length; i++) {
			let line = lines[i];
			if (line.startsWith('#type')) {
				const elements = line.split(/\s+/, 2);
				if (elements.length !== 2) {
					throw new ShaderError(name, `Unexpected instruction: ${line}. Expected shader type. Line: ${i + 1}. Column: 0.`);
				}

				if (elements[1] === 'vertex') {
					if ((usedStates & states.vertex) !== 0) {
						throw new ShaderError(name, `Unexpected instruction: ${line}. Vertex shader already defined. Line: ${i + 1}. Column: 0.`);
					}

					usedStates |= states.vertex;
					state = states.vertex;
				} else if (elements[1] === 'fragment') {
					if ((usedStates & states.fragment) !== 0) {
						throw new ShaderError(name, `Unexpected instruction: ${line}. Fragment shader already defined. Line: ${i + 1}. Column: 0.`);
					}

					usedStates |= states.fragment;
					state = states.fragment;
				} else {
					throw new ShaderError(name, `Unexpected instruction: ${line}. Wrong shader type. Line: ${i + 1}. Column: 0.`);
				}

				vertexSource += '\n';
				fragmentSource += '\n';
			} else {
				switch (state) {
					case states.vertex:
						vertexSource += `${line}\n`;
						fragmentSource += '\n';
						break;
					case states.fragment:
						fragmentSource += `${line}\n`;
						vertexSource += '\n';
						break;
				}
			}
		}

		if ((usedStates & states.vertex) === 0) {
			throw new ShaderError(name, 'No vertex shader.');
		}

		if ((usedStates & states.fragment) === 0) {
			throw new ShaderError('no fragment shader.');
		}

		return new Shader(resources, name, vertexSource, fragmentSource);
	}
}
