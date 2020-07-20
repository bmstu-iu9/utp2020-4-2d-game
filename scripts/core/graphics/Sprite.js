import Rect from './Rect.js';

export default class Sprite {
	/**
	 * @param {HTMLImageElement} image Изображение, которое будет использоваться в спрайте.
	 * @param {Rect} region Область спрайта на изображении.
	 */
	constructor(image, region = null) {
		if (!(image instanceof HTMLImageElement)) {
			throw new TypeError('invalid parameter "image". Expected an instance of HTMLImageElement class.');
		}
		if (region == null) {
			region = new Rect(0, 0, image.width, image.height);
		} else if (!(region instanceof Rect)) {
			throw new TypeError('invalid parameter "region". Expected an instance of Rect class.');
		} else if (region.x + region.width > image.width) {
			throw new Error('region width is larger than image width');
		} else if (region.y + region.height > image.height) {
			throw new Error('region height is larger than image height');
		}
		this.image = image;
		this.region = region;
	}
}
