import Sprite from './Sprite.js';
import Rect from './Rect.js';

export default class SpriteSheet {
	/**
	 * @param {HTMLImageElement} image Изображение для данного спрайт листа.
	 * @param {[string, Rect][]} tiles Набор областей для спрайтов с их названиями.
	 */
	constructor(image, ...tiles) {
		if (!(image instanceof HTMLImageElement)) {
			throw new TypeError('invalid parameter "image". Expected an instance of HTMLImageElement class.');
		}
		this.sprites = {};
		this.count = 0;
		tiles.forEach(tile => {
			if (!Array.isArray(tile)) {
				throw new TypeError('invalid tile. Expected an array.');
			}
			if (tile.length !== 2) {
				throw new Error('invalid tile. Expected an array with sprite name and region.');
			}
			const [name, region] = tile;
			if (typeof name !== 'string') {
				throw new TypeError('invalid tile name. Expected a string.');
			}
			if (name.trim() === '') {
				throw new TypeError('invalid tile name. Expected a non-empty string.');
			}
			if (!(region instanceof Rect)) {
				throw new TypeError('invalid tile region. Expected an instance of Rect class.');
			}
			this.sprites[name] = new Sprite(image, region);
			this.count++;
		});
	}

	/**
	 * @param {string} name Название спрайта.
	 * 
	 * @return {Sprite} Возвращает спрайт по имени. Если он не будет найден, то вернется undefined.
	 */
	get(name) {
		return this.sprites[name];
	}
}
