import Rect from './Rect.js';
import Texture from './webgl/Texture.js';
import Vector2d from '../mathematics/Vector2d.js';
import Matrix3x3 from '../mathematics/Matrix3x3.js';

export default class Sprite {
	/**
	 * @param {Texture} Texture Текстура, которая будет использоваться в спрайте.
	 * @param {Rect}    region  Область спрайта на текстуре.
	 */
	constructor(texture, region = null) {
		if (!(texture instanceof Texture)) {
			throw new TypeError('invalid parameter "texture". Expected an instance of Texture class.');
		}

		if (region == null) {
			region = new Rect(0, 0, texture.width, texture.height);
		} else if (!(region instanceof Rect)) {
			throw new TypeError('invalid parameter "region". Expected an instance of Rect class.');
		} else if (region.x + region.width > texture.width) {
			throw new Error('region width is larger than image width');
		} else if (region.y + region.height > texture.height) {
			throw new Error('region height is larger than image height');
		}

		const sizeX = region.width / texture.pixelsPerUnit;
		const sizeY = region.height / texture.pixelsPerUnit;
		this.unitsToPixels = Matrix3x3.ofScaling(sizeX, sizeY);
		this.texture = texture;
		this.region = region;
		this.textureCoords = [
			new Vector2d(region.x / texture.width, 1 - (region.y + region.height) / texture.height),
			new Vector2d(region.x / texture.width, 1 - region.y / texture.height),
			new Vector2d((region.x + region.width) / texture.width, 1 - region.y / texture.height),
			new Vector2d((region.x + region.width) / texture.width, 1 - (region.y + region.height) / texture.height),
		];
	}
}
