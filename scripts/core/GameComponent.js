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
	 * Включает или выключает компонент.
	 * 
	 * @param {boolean} value Должен ли компонент включиться.
	 */
	setEnabled(value) {
		this.throwIfDestroyed();
		if (typeof value !== 'boolean') {
			throw new TypeError('invalid parameter "value". Expected a boolean.');
		}
		if (value == this.isEnabled) {
			return;
		}
		this.isEnabled = value;
		if (this.gameObject == null || !this.gameObject.isEnabledInHierarchy()) {
			return;
		}
		if (value && !this.isInitialized) {
			this.initialize();
			return;
		} else if (!this.isInitialized) {
			return;
		}
		if (value) {
			this.onEnable();
		} else {
			this.onDisable();
		}
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
