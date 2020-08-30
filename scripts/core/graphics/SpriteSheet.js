import Sprite from './Sprite.js';
import Rect from './Rect.js';
import Texture from './webgl/Texture.js';

export default class SpriteSheet {
	/**
	 * @param {Texture}          texture Текстура для данного спрайт листа.
	 * @param {[string, Rect][]} tiles   Набор областей для спрайтов с их названиями.
	 */
	constructor(texture, ...tiles) {
		if (!(texture instanceof Texture)) {
			throw new TypeError('invalid parameter "texture". Expected an instance of Texture class.');
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

			this.sprites[name] = new Sprite(texture, region);
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
