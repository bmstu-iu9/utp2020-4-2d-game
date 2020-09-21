import GameComponent from '../../GameComponent.js';
import Vector2d from '../../mathematics/Vector2d.js';

export default class Collider extends GameComponent {
	constructor() {
		super();
		if (new.target === Collider) {
			throw new TypeError('cannot create an instance of abstract class.');
		}
	}

	allowMultipleComponents() {
		return false;
	}

	/**
	 * Вычисляет опорную точку данного коллайдера по передаваемому направлению.
	 * 
	 * @param {Vector2d} direction
	 * 
	 * @return {Vector2d}
	 */
	supportPoint(direction) {

	}

	/**
	 * Вычисляет площадь данного коллайдера.
	 * 
	 * @return {number}
	 */
	calculateArea() {

	}

	/**
	 * Вычисляет момент инерции данного коллайдера относительно его центроида.
	 * 
	 * @param {number} mass
	 * 
	 * @return {number} 
	 */
	calculateInertia(mass) {

	}

	recalculate() {

	}

	onEnable() {
		this.recalculate();
	}
}
