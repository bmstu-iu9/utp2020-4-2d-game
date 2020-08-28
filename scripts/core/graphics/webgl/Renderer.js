import IndexBuffer from './IndexBuffer.js';
import VertexBuffer from './VertexBuffer.js';
import Attributes from './Attributes.js';
import Attribute from './Attribute.js';
import Shader from './Shader.js';
import Camera from '../Camera.js';
import Texture from './Texture.js';
import Game from '../../Game.js';
import Color from '../Color.js';
import Vector2d from '../../mathematics/Vector2d.js';
import Matrix3x3 from '../../mathematics/Matrix3x3.js';

class RendererData {
	constructor(maxTextureSlots, maxVertexCount, maxIndexCount) {
		const attributes = new Attributes(
			{name: 'a_Position', type: Attribute.vector2},
			{name: 'a_Color', type: Attribute.vector4},
			{name: 'a_TexIndex', type: Attribute.float},
			{name: 'a_TexCoords', type: Attribute.vector2},
		);
		this.vertices = new Float32Array(maxVertexCount * attributes.size);
		this.vertexBuffer = new VertexBuffer(maxVertexCount, attributes);

		const indices = maxVertexCount <= 2 ** 8 ? new Uint8Array(maxIndexCount) : new Uint16Array(maxIndexCount);
		for (let i = 0, offset = 0; i < maxIndexCount; i += 6, offset += 4) {
			indices[i + 0] = offset + 0;
			indices[i + 1] = offset + 1;
			indices[i + 2] = offset + 2;

			indices[i + 3] = offset + 0;
			indices[i + 4] = offset + 3;
			indices[i + 5] = offset + 2;
		}
		this.indexBuffer = new IndexBuffer(indices);

		/**
		 * @type {number[]}
		 */
		this.textureIndices = new Array(maxTextureSlots);
		for (let i = 0; i < maxTextureSlots; i++) {
			this.textureIndices[i] = i;
		}

		/**
		 * @type {Texture[]}
		 */
		this.textureSlots = new Array(maxTextureSlots);

		this.quadIndex = 0;
		this.textureIndex = 0;
		this.vertexIndex = 0;
		this.offset = 0;

		this.positions = [
			new Vector2d(-0.5, -0.5),
			new Vector2d(-0.5, 0.5),
			new Vector2d(0.5, 0.5),
			new Vector2d(0.5, -0.5),
		];
	}

	destroy() {
		this.vertexBuffer.destroy();
		this.indexBuffer.destroy();
	}

	reset() {
		this.quadIndex = 0;
		for (let i = 0; i < this.textureIndex; i++) {
			this.textureSlots[i] = null;
		}
		this.textureIndex = 0;
		this.offset = 0;
	}

	setPosition(matrix) {
		const position = this.positions[this.vertexIndex];
		this.vertices[this.offset++] = matrix[0] * position.x + matrix[3] * position.y + matrix[6];
		this.vertices[this.offset++] = matrix[1] * position.x + matrix[4] * position.y + matrix[7];
	}

	setColor(color) {
		this.vertices[this.offset++] = color.rgba[0];
		this.vertices[this.offset++] = color.rgba[1];
		this.vertices[this.offset++] = color.rgba[2];
		this.vertices[this.offset++] = color.rgba[3];
	}

	setTexIndex(index) {
		this.vertices[this.offset++] = index;
	}

	/**
	 * 
	 * @param {Vector2d[]} textureCoords 
	 */
	setTexCoords(textureCoords) {
		const coords = textureCoords[this.vertexIndex];
		this.vertices[this.offset++] = coords.x;
		this.vertices[this.offset++] = coords.y;
	}

	nextVertex() {
		this.vertexIndex++;
		if (this.vertexIndex === 4) {
			this.vertexIndex = 0;
			this.quadIndex++;
		}
	}
}

export default class Renderer {
	/**
	 * @type {WebGLRenderingContext}
	 */
	static gl;
	/**
	 * @type {number}
	 */
	static maxTextureSlots;
	/**
	 * @type {number}
	 */
	static maxQuadCount;
	/**
	 * @type {number}
	 */
	static maxVertexCount;
	/**
	 * @type {number}
	 */
	static maxIndexCount;
	/**
	 * @type {RendererData}
	 */
	static data;
	/**
	 * @type {number}
	 */
	static drawCalls;

	/**
	 * @param {HTMLCanvasElement} canvas
	 * @param {number}            maxQuadCount Максимальное количество квадратов в одной партии.
	 */
	static initialize(canvas, maxQuadCount = 5000) {
		if (typeof maxQuadCount !== 'number') {
			throw new TypeError('invalid parameter "maxQuadCount". Expected a number.');
		}

		const limit = 2 ** 16 / 4;
		if (maxQuadCount > limit) {
			throw new Error(`quad count limit - ${limit}.`);
		}

		Renderer.gl = canvas.getContext('webgl');
		if (Renderer.gl == null) {
			throw new Error('cannot use webgl.');
		}

		const gl = Renderer.gl;
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.enable(gl.BLEND);

		Renderer.maxQuadCount = maxQuadCount;
		Renderer.maxVertexCount = maxQuadCount * 4;
		Renderer.maxIndexCount = maxQuadCount * 6;

		Renderer.maxTextureSlots = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);

		Renderer.data = new RendererData(Renderer.maxTextureSlots, Renderer.maxVertexCount, Renderer.maxIndexCount);

		Renderer.drawCalls = 0;
	}

	static flush() {
		if (Renderer.data.quadIndex === 0) {
			return;
		}

		Renderer.data.vertexBuffer.setData(Renderer.data.vertices);
		for (let i = 0; i < Renderer.data.textureIndex; i++) {
			Renderer.data.textureSlots[i].bind(i);
		}

		const gl = Renderer.gl;
		gl.drawElements(gl.TRIANGLES, Renderer.data.quadIndex * 6, Renderer.data.indexBuffer.type, 0);
		Renderer.drawCalls++;

		Renderer.data.reset();
	}

	/**
	 * @param {number}   x     Начало области экрана по x.
	 * @param {number}   y     Начало области экрана по y.
	 * @param {Vector2d} size  Размер области экрана.
	 * @param {Color}    color Цвет, которым будет закрашена передаваемая область экрана.
	 */
	static clear(x, y, size, color) {
		Renderer.gl.viewport(x, y, size.x, size.y);
		Renderer.gl.clearColor(color.rgba[0], color.rgba[1], color.rgba[2], color.rgba[3]);
		Renderer.gl.clear(Renderer.gl.COLOR_BUFFER_BIT);
	}

	/**
	 * Настраивает все для начала процесса отрисовки.
	 * 
	 * @param {Camera} camera Камера, в которой будет происходить отрисовка.
	 * @param {Shader} shader Шейдер, который будет использоваться во время отрисовки.
	 */
	static begin(camera, shader = null) {
		if (shader == null) {
			shader = Game.resources.getShader('texture');
		}

		shader.bind();
		shader.setMatrix3x3('u_ViewProjectionMatrix', camera.viewProjectionMatrix);
		shader.setIntArray('u_Textures', Renderer.data.textureIndices);

		Renderer.data.vertexBuffer.bind();
		Renderer.drawCalls = 0;
	}

	/**
	 * Заканчивает процесс отрисовки.
	 */
	static end() {
		Renderer.flush();
	}

	/**
	 * Отрисовывает прямоугольник.
	 * 
	 * @param {Matrix3x3}  modelMatrix   Матрица преобразований прямоугольника.
	 * @param {Texture}    texture       Текстура прямоугольника.
	 * @param {Vector2d[]} textureCoords Координаты текстуры.
	 * @param {Color}      color         Цвет прямоугольника.
	 */
	static drawQuad(modelMatrix, texture, textureCoords, color = Color.white) {
		const data = Renderer.data;

		if (data.quadIndex >= Renderer.maxQuadCount) {
			this.flush();
		}

		let textureIndex = -1;
		for (let i = 0; i < data.textureIndex; i++) {
			if (texture === data.textureSlots[i]) {
				textureIndex = i;
				break;
			}
		}

		if (textureIndex === -1) {
			if (data.textureIndex >= Renderer.maxTextureSlots) {
				this.flush();
			}

			data.textureSlots[data.textureIndex] = texture;
			textureIndex = data.textureIndex;
			data.textureIndex++;
		}

		for (let i = 0; i < 4; i++) {
			data.setPosition(modelMatrix);
			data.setColor(color);
			data.setTexIndex(textureIndex);
			data.setTexCoords(textureCoords);
			data.nextVertex();
		}
	}

	static destroy() {
		Renderer.gl = null;
		Renderer.data.destroy();
		Renderer.data = null;
		Renderer.drawCalls = null;
		Renderer.maxQuadCount = null;
		Renderer.maxVertexCount = null;
		Renderer.maxIndexCount = null;
		Renderer.maxTextureSlots = null;
	}
}
