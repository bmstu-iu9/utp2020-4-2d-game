import Renderer from './Renderer.js';
import Sprite from './Sprite.js';
import Vector2d from '../Vector2d.js';

export default class SpriteRenderer extends Renderer {
	/**
	 * @param {Sprite} sprite Спрайт, который будет отрисовываться каждый кадр.
	 */
	constructor(sprite) {
		super();
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
	 * @param {CanvasRenderingContext2D} context Контекст, в котором будет происходить отрисовка.
	 */
	onDraw(context) {
		let position = this.gameObject.position;
		const size = this.sprite.size;
		const scale = this.gameObject.scale;
		const rotation = this.gameObject.rotation;

		const canvas = context.canvas;
		position = new Vector2d(position.x, -position.y);
		position = position.add(new Vector2d(canvas.clientWidth / 2, canvas.clientHeight / 2));
	
		context.save();
		context.translate(position.x, position.y);
		context.rotate(rotation);
		context.scale(scale.x, scale.y);
		context.drawImage(this.sprite.image, -size.x / 2, -size.y / 2);
		context.restore();
	}
}