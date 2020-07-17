import Vector2d from '../Vector2d.js';

export default class Sprite {
	/**
	 * @param {HTMLImageElement} image Изображение, которое будет использоваться в спрайте.
	 */
	constructor(image) {
		if (!(image instanceof HTMLImageElement)) {
			throw new TypeError('invalid parameter "image". Expected an instance of HTMLImageElement class.');
		}
		this.image = image;
		this.size = new Vector2d(image.width, image.height);
	}
}
