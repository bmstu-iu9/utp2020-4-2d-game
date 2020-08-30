import RendererComponent from './RendererComponent.js';
import Sprite from './Sprite.js';
import Camera from './Camera.js';
import Renderer from './webgl/Renderer.js';
import Color from './Color.js';
import Matrix3x3 from '../mathematics/Matrix3x3.js';

export default class SpriteRenderer extends RendererComponent {
	/**
	 * @param {object} settings
	 * @param {Sprite} settings.sprite Спрайт, который будет отрисовываться каждый кадр.
	 * @param {number} settings.color  Цвет спрайта.
	 * @param {number} settings.layer  Слой отрисовки.
	 */
	constructor({sprite, color = Color.white, layer = 0}) {
		super(layer);
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
	 * Отрисовывает спрайт.
	 * 
	 * @param {Camera} camera  Камера, в которой будет происходить отрисовка.
	 */
	draw(camera) {
		Renderer.drawQuad(
			this.getModelMatrix(),
			this.sprite.texture,
			this.sprite.textureCoords,
			this.color,
		);
	}
}
