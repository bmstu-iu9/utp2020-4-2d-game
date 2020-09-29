import RendererComponent from './RendererComponent.js';
import Sprite from './Sprite.js';
import Camera from './Camera.js';
import Renderer from './webgl/Renderer.js';
import Color from './Color.js';
import Matrix3x3 from '../mathematics/Matrix3x3.js';

export default class SpriteRenderer extends RendererComponent {
	/**
	 * @param {object}  settings
	 * @param {Sprite}  settings.sprite Спрайт, который будет отрисовываться каждый кадр.
	 * @param {boolean} settings.flipX  Надо ли повернуть изображение по x.
	 * @param {boolean} settings.flipY  Надо ли повернуть изображение по y.
	 * @param {number}  settings.color  Цвет спрайта.
	 * @param {number}  settings.layer  Слой отрисовки.
	 */
	constructor({sprite, flipX = false, flipY = false, color = Color.white, layer = 0}) {
		super(layer);
		if (typeof flipX !== 'boolean') {
			throw new TypeError('invalid parameter "flipX". Expected a boolean value.');
		}

		if (typeof flipY !== 'boolean') {
			throw new TypeError('invalid parameter "flipY". Expected a boolean value.');
		}
		
		this.flipX = flipX;
		this.flipY = flipY;
		this.textureCoords = new Array(4);
		this.setSprite(sprite);
		this.setColor(color);
		this.modelMatrix = null;
	}

	/**
	 * @return {Matrix3x3} Возвращает матрицу преобразований для данного спрайта.
	 */
	getModelMatrix() {
		if (this.changeId != this.transform.changeId) {
			/**
			 * @type {Matrix3x3}
			 */
			this.modelMatrix = this.transform.worldMatrix.multiply(this.sprite.unitsToPixels, this.modelMatrix);
			this.changeId = this.transform.changeId;
		}

		return this.modelMatrix;
	}

	onInitialize() {
		this.modelMatrix = this.getModelMatrix();
	}

	updateTextureCoords() {
		for (let i = 0; i < 4; i++) {
			this.textureCoords[i] = this.sprite.textureCoords[i];
		}

		const swap = (a, b) => {
			const temp = this.textureCoords[a];
			this.textureCoords[a] = this.textureCoords[b];
			this.textureCoords[b] = temp;
		}

		if (this.flipX) {
			swap(0, 3);
			swap(1, 2);
		}

		if (this.flipY) {
			swap(0, 1);
			swap(2, 3);
		}
	}

	/**
	 * Изменяет спрайт.
	 * 
	 * @param {Sprite} sprite Спрайт, который будет отрисовываться каждый кадр.
	 */
	setSprite(sprite) {
		if (!(sprite instanceof Sprite)) {
			throw new TypeError('invalid parameter "sprite". Expected an instance of Sprite class.');
		}

		this.sprite = sprite;
		this.updateTextureCoords();
	}

	/**
	 * Изменяет цвет спрайта.
	 * 
	 * @param {Color} color Новый цвет спрайта.
	 */
	setColor(color) {
		if (!(color instanceof Color)) {
			throw new TypeError('invalid parameter "color". Expected an instance of Color class.');
		}
		
		this.color = color;
	}

	/**
	 * Устанавливает поворот изображения по x.
	 * 
	 * @param {boolean} flipX Надо ли повернуть изображение по x.
	 */
	setFlipX(flipX) {
		if (typeof flipX !== 'boolean') {
			throw new TypeError('invalid parameter "flipX". Expected a boolean value.');
		}

		this.flipX = flipX;
		this.updateTextureCoords();
	}

	/**
	 * Устанавливает поворот изображения по y.
	 * 
	 * @param {boolean} flipY Надо ли повернуть изображение по y.
	 */
	setFlipY(flipY) {
		if (typeof flipY !== 'boolean') {
			throw new TypeError('invalid parameter "flipY". Expected a boolean value.');
		}

		this.flipY = flipY;
		this.updateTextureCoords();
	}
	
	/**
	 * Отрисовывает спрайт.
	 * 
	 * @param {Camera} camera  Камера, в которой будет происходить отрисовка.
	 */
	draw(camera) {
		Renderer.drawQuad(
			this.getModelMatrix(),
			this.sprite.texture,
			this.textureCoords,
			this.color,
		);
	}
}
