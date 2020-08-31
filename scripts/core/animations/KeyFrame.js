import GameObject from '../GameObject.js';

export default class KeyFrame {
	/**
	 * @param {number} time Время, когда активируется кадр.
	 */
	constructor(time) {
		if (typeof time !== 'number') {
			throw new TypeError('invalid parameter "time". Expected a number.');
		}
		this.time = time;
	}
	
	/**
	 * Обрабатывает объект с учётом особенностей кадра.
	 * 
	 * @param {GameObject} gameObject Объект, который использует данный кадр.
	 */
	process(gameObject) {

	}
}