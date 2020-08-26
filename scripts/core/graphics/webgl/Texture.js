import Renderer from './Renderer.js';
import Scene from '../../Scene.js';

export default class Texture {
	static maxWidth = 4096;
	static maxHeight = 4096;

	/**
	 * @param {Scene}            scene         Сцена, на которой будет использоваться текстура.
	 * @param {HTMLImageElement} image         Изображение, которое будет использоваться в текстуре.
	 * @param {number}           pixelsPerUnit Количество пикселей текстуры на одну условную единицу камеры.
	 * @param {boolean}          isPixelImage  Если указано true, то для масштабирования текстуры используется алгоритм NEAREST, иначе LINEAR.
	 */
	constructor(scene, image, pixelsPerUnit = 100, isPixelImage = true) {
		if (!(scene instanceof Scene)) {
			throw new TypeError('invalid parameter "scene". Expected an instance of Scene class.');
		}

		if (!(image instanceof HTMLImageElement)) {
			throw new TypeError('invalid parameter "image". Expected an instance of HTMLImageElement class.');
		}

		if (image.width > Texture.maxWidth) {
			throw new Error(`cannot create texture with width - ${image.width}. Max texture width - ${Texture.maxWidth}.`);
		}

		if (image.height > Texture.maxWidth) {
			throw new Error(`cannot create texture with width - ${image.height}. Max texture width - ${Texture.maxHeight}.`);
		}

		if (typeof pixelsPerUnit != 'number') {
			throw new TypeError('invalid parameter "pixelsPerUnit". Expected a number.');
		}

		if (pixelsPerUnit < 1) {
			throw new Error('invalid parameter "pixelsPerUnit". Value must be greater than 0.');
		}

		if (typeof isPixelImage !== 'boolean') {
			throw new TypeError('invalid parameter "isPixelImage". Expected a boolean value.');
		}

		this.image = image;
		this.pixelsPerUnit = pixelsPerUnit;
		scene.objectsToDestroy.add(this);
		this.scene = scene;

		const gl = Renderer.gl;
		this.textureId = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.textureId);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, isPixelImage ? gl.NEAREST : gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, isPixelImage ? gl.NEAREST : gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	}

	/**
	 * Устанавливает количество пикселей текстуры на одну условную единицу камеры.
	 * 
	 * @param {number} value Новое значение.
	 */
	setPixelsPerUnit(value) {
		if (typeof value != 'number') {
			throw new TypeError('invalid parameter "value". Expected a number.');
		}

		if (value < 1) {
			throw new Error('invalid parameter "value". Value must be greater than 0.');
		}

		this.pixelsPerUnit = value;
	}

	/**
	 * Привязывает текстуру к переданному слоту.
	 * 
	 * @param {number} slot Слот, к которому привяжется текстура.
	 */
	bind(slot) {
		if (this.texture == null) {
			throw new Error('texture is destroyed.');
		}

		if (typeof slot != 'number') {
			throw new TypeError('invalid parameter "slot". Expected a number.');
		}

		if (slot < 0 || slot >= Renderer.maxTextureSlots) {
			throw new RangeError(`parameter "slot" must be in range [0; ${Renderer.maxTextureSlots}).`);
		}

		const gl = Renderer.gl;
		gl.activeTexture(gl.TEXTURE0 + slot);
		gl.bindTexture(gl.TEXTURE_2D, this.textureId);
	}

	/**
	 * Отвязывает текстуру.
	 */
	unbind() {
		const gl = Renderer.gl;
		gl.bindTexture(gl.TEXTURE_2D, 0);
	}

	destroy() {
		if (this.texture == null) {
			return;
		}

		this.scene.objectsToDestroy.delete(this);
		Renderer.gl.deleteTexture(this.textureId);
		this.texture = null;
	}
}
