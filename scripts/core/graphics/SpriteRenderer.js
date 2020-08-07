import Renderer from './Renderer.js';
import Sprite from './Sprite.js';
import Camera from './Camera.js';
import Vector2d from '../Vector2d.js';

export default class SpriteRenderer extends Renderer {
	/**
	 * @param {Sprite} sprite Спрайт, который будет отрисовываться каждый кадр.
	 * @param {number} layer  Слой отрисовки.
	 */
	constructor(sprite, layer = 0) {
		super(layer);
		this.setSprite(sprite);
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
	 * Отрисовывает спрайт.
	 * 
	 * @param {Camera}                   camera  Камера, в которой будет происходить отрисовка.
	 * @param {CanvasRenderingContext2D} context Контекст, в котором будет происходить отрисовка.
	 */
	draw(camera, context) {
		const offset = camera.worldToCameraPosition(Vector2d.zero);
		const region = this.sprite.region;
	
		context.save();
		const matrix = this.transform.worldMatrix;
		context.transform(
			matrix[0], matrix[1],
			matrix[3], matrix[4],
			offset.x + matrix[6] * 100, offset.y + matrix[7] * 100,
		);
		context.drawImage(
			this.sprite.image,
			region.x,
			region.y,
			region.width,
			region.height,
			-region.width / 2,
			-region.height / 2,
			region.width,
			region.height,
		);
		context.restore();
	}
}
