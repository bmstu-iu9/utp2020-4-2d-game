import Vector2d from '../mathematics/Vector2d.js';
import Color from './Color.js';

export default class ParticleProperties {
	/**
	 * @param {object}   settings                   Настройки частицы.
	 * @param {Vector2d} settings.position          Начальная позиция частицы в локальных координатах.
	 * @param {Vector2d} settings.positionVariation Допустимое изменение начальной позиции частицы.
	 * @param {Vector2d} settings.velocity          Начальная скорость частицы.
	 * @param {Vector2d} settings.velocityVariation Допустимое изменение начальной скорости частицы.
	 * @param {Color}    settings.colorBegin        Начальный цвет частицы.
	 * @param {Color}    settings.colorEnd          Конечный цвет частицы.
	 * @param {number}   settings.sizeBegin         Начальный размер частицы.
	 * @param {number}   settings.sizeEnd           Конечный размер частицы.
	 * @param {number}   settings.sizeVariation     Допустимое изменение начального и конечного размера частицы.
	 * @param {number}   settings.lifeTime          Время существования частицы.
	 */
	constructor({
		position,
		positionVariation = Vector2d.zero,
		velocity,
		velocityVariation = Vector2d.zero,
		colorBegin,
		colorEnd,
		sizeBegin,
		sizeEnd,
		sizeVariation = 0,
		lifeTime = 1
	}) {
		if (!(position instanceof Vector2d)) {
			throw new TypeError('invalid parameter "position". Expected an instance of Vector2d class.');
		}

		if (!(positionVariation instanceof Vector2d)) {
			throw new TypeError('invalid parameter "positionVariation". Expected an instance of Vector2d class.');
		}

		if (!(velocity instanceof Vector2d)) {
			throw new TypeError('invalid parameter "velocity". Expected an instance of Vector2d class.');
		}

		if (!(velocityVariation instanceof Vector2d)) {
			throw new TypeError('invalid parameter "velocityVariation". Expected an instance of Vector2d class.');
		}

		if (!(colorBegin instanceof Color)) {
			throw new TypeError('invalid parameter "colorBegin". Expected an instance of Color class.');
		}

		if (!(colorEnd instanceof Color)) {
			throw new TypeError('invalid parameter "colorEnd". Expected an instance of Color class.');
		}

		if (typeof sizeBegin !== 'number') {
			throw new TypeError('invalid parameter "sizeBegin". Expected a number.');
		}

		if (typeof sizeEnd !== 'number') {
			throw new TypeError('invalid parameter "sizeEnd". Expected a number.');
		}

		if (typeof sizeVariation !== 'number') {
			throw new TypeError('invalid parameter "sizeVariation". Expected a number.');
		}

		if (typeof lifeTime !== 'number') {
			throw new TypeError('invalid parameter "lifeTime". Expected a number.');
		}

		this.position = position;
		this.positionVariation = positionVariation;
		this.velocity = velocity;
		this.velocityVariation = velocityVariation;
		this.colorBegin = colorBegin;
		this.colorEnd = colorEnd;
		this.sizeBegin = sizeBegin;
		this.sizeEnd = sizeEnd;
		this.sizeVariation = sizeVariation;
		this.lifeTime = lifeTime;
	}
}
