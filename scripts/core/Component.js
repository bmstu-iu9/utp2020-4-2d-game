import GameObject from './GameObject.js';

export default class Component {
	constructor() {
		if (new.target === Component) {
			throw new TypeError('cannot create instance of abstract class.');
		}
		this.isEnabled = true;
		this.isInitialized = false;
		this.isDestroyed = false;
		/**
		 * @type {GameObject}
		 */
		this.gameObject = null;
	}
	
	/**
	 * Выбрасывает ошибку, если компонент уничтожен.
	 */
	throwIfDestroyed() {
		if (this.isDestroyed) {
			throw new Error('component is destroyed.');
		}
	}

	/**
	 * @return {boolean} Возвращает false, если нельзя использовать несколько экземляров данного компонента на игровом объекте. В остальных случаях возвращает true.
	 */
	allowMultipleComponents() {
		return true;
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
		if (this.gameObject == null) {
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
	 * Инициализирует данный компонент. Но если он отключен, то ничего не делает.
	 */
	initialize() {
		this.throwIfDestroyed();
		if (this.isInitialized) {
			throw new Error('already initialized.');
		}
		if (this.gameObject == null) {
			throw new Error('component is not attached to gameobject.');
		}
		if (this.isEnabled) {
			this.isInitialized = true;
			this.onInitialize();
			this.onEnable();
		}
	}

	/**
	 * Вызывается во время инициализации компонента.
	 */
	onInitialize() {
	}
	
	/**
	 * Вызывается, когда компонент включается.
	 */
	onEnable() {
	}

	/**
	 * Вызывается во время каждого кадра.
	 * 
	 * @param {number} deltaTime Время, которое прошло с прошлого кадра в миллисекундах.
	 */
	onFrameUpdate(deltaTime) {
	}

	/**
	 * Вызывается во время каждого кадра в конце.
	 * 
	 * @param {number} deltaTime Время, которое прошло с прошлого кадра в миллисекундах.
	 */
	onFrameUpdateEnd(deltaTime) {
	}

	/**
	 * Вызывается, когда компонент выключается.
	 */
	onDisable() {
	}

	/**
	 * Вызывается во время уничтожения компонента.
	 */
	onDestroy() {
	}

	/**
	 * Уничтожает компонент.
	 */
	destroy() {
		this.throwIfDestroyed();
		if (this.gameObject == null) {
			throw new Error('component is not attached to gameobject.');
		}
		if (this.isInitialized) {
			this.setEnabled(false);
			this.onDestroy();
		}
		this.isDestroyed = true;
		this.gameObject.removeDestroyedComponents();
		this.gameObject = null;
	}
	
	/**
	 * Привязывает данный компонент к игровому объекту.
	 * 
	 * @param {GameObject} gameObject Игровой объект, к которому привяжется данный компонент.
	 */
	attach(gameObject) {
		this.throwIfDestroyed();
		if (gameObject == this.gameObject) {
			return;
		}
		if (this.gameObject != null) {
			throw new Error('component already attached to other gameobject.');
		}
		if (!(gameObject instanceof GameObject)) {
			throw new TypeError('invalid parameter "gameObject". Expected an instance of GameObject class.');
		}
		this.gameObject = gameObject;
	}
}
