import RendererComponent from './RendererComponent.js';
import SpriteSheet from './SpriteSheet.js';
import Vector2d from '../mathematics/Vector2d.js';
import Camera from './Camera.js';
import Matrix3x3 from '../mathematics/Matrix3x3.js';
import Renderer from './webgl/Renderer.js';
import Sprite from './Sprite.js';
import Color from './Color.js';

export default class TileMap extends RendererComponent {
	/**
	 * @param {object}      settings             Настройки.
	 * @param {SpriteSheet} settings.spriteSheet Лист, который содержит используемые в карте спрайты.
	 * @param {string[][]}  settings.map         Двумерный массив строк (элементы могут быть null), из которого будет построен TileMap.
	 * @param {Color}       settings.color       Цвет карты.
	 * @param {number}      settings.layer       Слой отрисовки.
	 */
	constructor({spriteSheet, map, color = Color.white, layer = 0}) {
		super(layer);
		if (!(spriteSheet instanceof SpriteSheet)) {
			throw new TypeError('invalid parameter "spriteSheet". Expected an instance of SpriteSheet class.');
		}

		if (!Array.isArray(map)) {
			throw new TypeError('invalid parameter "map". Expected an array.');
		}

		if (!(color instanceof Color)) {
			throw new TypeError('invalid parameter "color". Expected an instance of Color class.');
		}

		/**
		 * @type {Sprite[][]}
		 */
		this.map = [];
		/**
		 * @type {Matrix3x3[][]}
		 */
		this.modelMatrices = [];
		/**
		 * @type {Matrix3x3[][]}
		 */
		this.localModelMatrices = [];
		this.height = 0;
		this.width = 0;
		this.color = color;
		map.forEach(layer => {
			if (!Array.isArray(layer)) {
				throw new TypeError('invalid "map" array value. Expected an array.');
			}

			this.map.push([]);
			this.modelMatrices.push([]);
			this.localModelMatrices.push([]);
			layer.forEach(name => {
				if (name == null) {
					this.map[this.map.length - 1].push(null);
					this.modelMatrices[this.map.length - 1].push(null);
					this.localModelMatrices[this.map.length - 1].push(null);
					return;
				}

				if (typeof name !== 'string') {
					throw new TypeError('invalid sprite name. Expected a string.');
				}

				const sprite = spriteSheet.get(name);
				if (sprite == null) {
					throw new Error(`unexpected sprite name "${name}".`);
				}

				this.map[this.map.length - 1].push(sprite);
				this.modelMatrices[this.map.length - 1].push(new Matrix3x3());
				this.localModelMatrices[this.map.length - 1].push(new Matrix3x3());
			});

			if (layer.length > this.width) {
				this.width = layer.length;
			}
		});

		this.height = this.map.length;

		const offset = new Vector2d(
			Math.ceil(this.width / 2),
			Math.ceil(this.height / 2),
		);

		const positionMatrix = new Matrix3x3();
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.map[i].length; j++) {
				const sprite = this.map[i][j];
				if (sprite == null) {
					continue;
				}

				const matrix = this.localModelMatrices[i][j];
				const spritePositionX = j - offset.x;
				const spritePositionY = this.height - i - offset.y;
				Matrix3x3.ofTranslation(spritePositionX, spritePositionY, positionMatrix);
				positionMatrix.multiply(sprite.unitsToPixels, matrix);
			}
		}
	}

	/**
	 * @return {Matrix3x3} Возвращает матрицу преобразований для каждого спрайта в карте.
	 */
	getModelMatrices() {
		if (this.changeId != this.transform.changeId) {
			const worldMatrix = this.transform.worldMatrix;
			for (let i = 0; i < this.height; i++) {
				for (let j = 0; j < this.map[i].length; j++) {
					const sprite = this.map[i][j];
					if (sprite == null) {
						continue;
					}
	
					const modelMatrix = this.modelMatrices[i][j];
					const localModelMatrix = this.localModelMatrices[i][j];
					worldMatrix.multiply(localModelMatrix, modelMatrix);
				}
			}

			this.changeId = this.transform.changeId;
		}

		return this.modelMatrices;
	}

	onInitialize() {
		this.modelMatrices = this.getModelMatrices();
	}

	/**
	 * Изменяет цвет карты.
	 * 
	 * @param {Color} color Новый цвет карты.
	 */
	setColor(color) {
		if (!(color instanceof Color)) {
			throw new TypeError('invalid parameter "color". Expected an instance of Color class.');
		}
		
		this.color = color;
	}
	
	/**
	 * Отрисовывает TileMap.
	 * 
	 * @param {Camera} camera  Камера, в которой будет происходить отрисовка.
	 */
	draw(camera) {
		const modelMatrices = this.getModelMatrices();
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.map[i].length; j++) {
				const sprite = this.map[i][j];
				if (sprite == null) {
					continue;
				}

				Renderer.drawQuad(
					modelMatrices[i][j],
					sprite.texture,
					sprite.textureCoords,
					this.color,
				);
			}
		}
	}
}
