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
	 * Вызывается перед обновлением физики.
	 * 
	 * @param {number} fixedDeltaTime Фиксированное время обновления физики.
	 */
	onPhysicsUpdate(fixedDeltaTime) {
	}

	/**
	 * Вызывается во время каждого кадра в конце.
	 * 
	 * @param {number} deltaTime Время, которое прошло с прошлого кадра в миллисекундах.
	 */
	onFrameUpdateEnd(deltaTime) {
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
