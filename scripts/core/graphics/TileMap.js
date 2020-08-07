import Renderer from './Renderer.js';
import SpriteSheet from './SpriteSheet.js';
import Vector2d from '../Vector2d.js';
import Camera from './Camera.js';

export default class TileMap extends Renderer {
	/**
	 * @param {number}      tileWidth   Ширина одной плитки.
	 * @param {number}      tileHeight  Высота одной плитки.
	 * @param {SpriteSheet} spriteSheet Лист, который содержит используемые в карте спрайты.
	 * @param {string[][]}  map         Двумерный массив строк (элементы могут быть null), из которого будет построен TileMap.
	 * @param {number}      layer       Слой отрисовки.
	 */
	constructor(tileWidth, tileHeight, spriteSheet, map, layer = 0) {
		super(layer);
		if (typeof tileWidth !== 'number') {
			throw new TypeError('invalid parameter "tileWidth". Expected a number.');
		}
		if (typeof tileHeight !== 'number') {
			throw new TypeError('invalid parameter "tileHeight". Expected a number.');
		}
		if (tileWidth <= 0) {
			throw new RangeError('invalid parameter "tileWidth". The value must be greater than 0.');
		}
		if (tileHeight <= 0) {
			throw new RangeError('invalid parameter "tileWidth". The value must be greater than 0.');
		}
		if (!(spriteSheet instanceof SpriteSheet)) {
			throw new TypeError('invalid parameter "spriteSheet". Expected an instance of SpriteSheet class.');
		}
		if (!Array.isArray(map)) {
			throw new TypeError('invalid parameter "map". Expected an array.');
		}

		this.map = [];
		this.height = 0;
		this.width = 0;
		this.tileHeight = tileHeight;
		this.tileWidth = tileWidth;

		let lastIndexNonEmptyLayer = -1;

		map.forEach(layer => {
			if (!Array.isArray(layer)) {
				throw new TypeError('invalid "map" array value. Expected an array.');
			}
			this.map.push([]);
			let lastIndexNotNullSprite = -1; 
			layer.forEach(name => {
				if (name == null) {
					this.map[this.map.length - 1].push(null);
					return;
				}
				if (typeof name !== 'string') {
					throw new TypeError('invalid sprite name. Expected a string.');
				}
				const sprite = spriteSheet.get(name);
				if (sprite == null) {
					throw new Error(`unexpected sprite name "${name}".`);
				}
				if (sprite.region.width !== tileWidth) {
					throw new Error(`sprite with name ${name} has the wrong width.`);
				}
				if (sprite.region.height !== tileHeight) {
					throw new Error(`sprite with name ${name} has the wrong height.`);
				}
				lastIndexNotNullSprite = this.map[this.map.length - 1].length;
				this.map[this.map.length - 1].push(sprite);
			});

			if (lastIndexNotNullSprite === -1) {
				this.map[this.map.length - 1] = [];
			} else if (lastIndexNotNullSprite !== layer.length - 1) {
				this.map[this.map.length - 1] = this.map[this.map.length - 1].slice(0, lastIndexNotNullSprite + 1);
			}

			if (this.map[this.map.length - 1].length != 0) {
				lastIndexNonEmptyLayer = this.map.length - 1;
			}

			if (layer.length > this.width) {
				this.width = layer.length;
			}
		});

		if (lastIndexNonEmptyLayer === -1) {
			this.map = [];
		} else if (lastIndexNonEmptyLayer !== this.map.length - 1) {
			this.map = this.map.slice(0, lastIndexNonEmptyLayer + 1);
		}
		this.height = this.map.length;
	}
	
	/**
	 * Отрисовывает TileMap.
	 * 
	 * @param {Camera}                   camera  Камера, в которой будет происходить отрисовка.
	 * @param {CanvasRenderingContext2D} context Контекст, в котором будет происходить отрисовка.
	 */
	draw(camera, context) {
		const positionOffset = camera.worldToCameraPosition(Vector2d.zero);
		const offset = new Vector2d(
			this.width / 2 * (this.tileWidth - 1),
			this.height / 2 * (this.tileHeight - 1),
		);

		context.save();
		const matrix = this.transform.worldMatrix;
		context.transform(
			matrix[0], matrix[1],
			matrix[3], matrix[4],
			positionOffset.x + matrix[6] * 100, positionOffset.y + matrix[7] * 100,
		);
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.map[i].length; j++) {
				const sprite = this.map[i][j];
				if (sprite == null) {
					continue;
				}
				const spritePositionX = j * this.tileWidth - offset.x;
				const spritePositionY = i * this.tileHeight - offset.y;
				context.drawImage(
					sprite.image,
					sprite.region.x,
					sprite.region.y,
					sprite.region.width,
					sprite.region.height,
					spritePositionX,
					spritePositionY,
					sprite.region.width,
					sprite.region.height,
				);
			}
		}
		context.restore();
	}
}
