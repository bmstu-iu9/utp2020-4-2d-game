import Renderer from './Renderer.js';
import Sprite from './Sprite.js';
import Camera from './Camera.js';

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
		const position = camera.worldToCameraPosition(this.transform.position);
		const region = this.sprite.region;
		const scale = this.transform.scale;
		const rotation = this.transform.rotation;
	
		context.save();
		context.translate(position.x, position.y);
		context.rotate(rotation);
		context.scale(scale.x, scale.y);
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
