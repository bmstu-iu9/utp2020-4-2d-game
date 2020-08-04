import TransformComponent from './TransformComponent.js';
import GameObject from './GameObject.js';

export default class GameComponent extends TransformComponent {
	constructor() {
		super();
		/**
		 * @type {GameObject}
		 */
		this.gameObject = null;
	}

	/**
	 * Вызывается во время каждого обновления игрового объекта.
	 * 
	 * @param {number} fixedDeltaTime Фиксированное время обновления логики игры в секундах.
	 */
	onFixedUpdate(fixedDeltaTime) {
	}

	destroy() {
		super.destroy();
		this.gameObject = null;
	}

	attach(gameObject) {
		super.attach(gameObject);
		if (!(gameObject instanceof GameObject)) {
			throw new TypeError('invalid parameter "gameObject". Expected an instance of GameObject class.');
		}
		this.gameObject = gameObject;
	}
}
