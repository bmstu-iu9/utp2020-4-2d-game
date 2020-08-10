import TransformComponent from './TransformComponent.js';
import GameObject from './GameObject.js';
import HierarchyTransform from './mathematics/HierarchyTransform.js';

export default class GameComponent extends TransformComponent {
	constructor() {
		if (new.target === GameComponent) {
			throw new TypeError('cannot create instance of abstract class.');
		}
		super();
		/**
		 * @type {GameObject}
		 */
		this.gameObject = null;
		/**
		 * @type {HierarchyTransform}
		 */
		this.transform;
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
