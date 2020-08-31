import SpriteRenderer from '../graphics/SpriteRenderer.js';
import KeyFrame from './KeyFrame.js';
import Sprite from '../graphics/Sprite.js';
import GameObject from '../GameObject.js';

export default class SpriteKeyFrame extends KeyFrame {
	/**
	 * @param {Sprite} sprite Изображение, которое устанавливается во время обработки кадра.
	 * @param {number} time   Время, когда активируется кадр.
	 */
	constructor(sprite, time) {
		super(time);
		if (!(sprite instanceof Sprite)) {
			throw new TypeError('invalid parameter "sprite". Expected an instance of Sprite class.');
		}
		this.sprite = sprite;
	}

	/**
	 * Изменяет переданному объекту изображение.
	 * 
	 * @param {GameObject} gameObject Объект, который использует данный кадр.
	 */
	process(gameObject) {
		const spriteRenderer = gameObject.getComponent(SpriteRenderer);
		spriteRenderer.setSprite(this.sprite);
	}
}
