import ComponentObject from './ComponentObject.js';

export default class Component {
	constructor() {
		if (new.target === Component) {
			throw new TypeError('cannot create instance of abstract class.');
		}
		this.isEnabled = true;
		this.isInitialized = false;
		this.isDestroyed = false;
		/**
		 * @type {ComponentObject}
		 */
		this.componentObject = null;
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
	 * @return {boolean} Возвращает false, если нельзя использовать несколько экземляров данного компонента на объекте. В остальных случаях возвращает true.
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
		if (this.componentObject == null || !this.componentObject.isEnabled) {
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
	 * @return {boolean} Возвращает true, если компонент включен и не уничтожен, и привязанный объект включен и не уничтожен.
	 */
	isActive() {
		return this.componentObject != null && this.isEnabled && !this.isDestroyed && this.componentObject.isActive();
	}

	/**
	 * Инициализирует данный компонент. Но если он отключен, то ничего не делает.
	 */
	initialize() {
		this.throwIfDestroyed();
		if (this.isInitialized) {
			return;
		}
		if (this.componentObject == null) {
			throw new Error('component is not attached to component object.');
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
	onUpdate(deltaTime) {
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
		if (this.componentObject == null) {
			throw new Error('component is not attached to component object.');
		}
		if (this.isInitialized) {
			this.setEnabled(false);
			this.onDestroy();
		}
		this.isDestroyed = true;
		this.componentObject.removeDestroyedComponents();
		this.componentObject = null;
	}
	
	/**
	 * Привязывает данный компонент к объекту.
	 * 
	 * @param {ComponentObject} componentObject Объект, к которому привяжется данный компонент.
	 */
	attach(componentObject) {
		this.throwIfDestroyed();
		if (this.componentObject != null) {
			throw new Error('component already attached to component object.');
		}
		if (!(componentObject instanceof ComponentObject)) {
			throw new TypeError('invalid parameter "componentObject". Expected an instance of ComponentObject class.');
		}
		this.componentObject = componentObject;
	}
}
