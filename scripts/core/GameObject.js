import Vector2d from './Vector2d.js';
import ComponentObject from './ComponentObject.js';
import Transform from './Transform.js';
import Component from './Component.js';
import GameComponent from './GameComponent.js';

export default class GameObject extends ComponentObject {
	/**
	 * @param {object}       settings            Настройки игрового объекта.
	 * @param {string}       settings.name       Название игрового объекта.
	 * @param {boolean}      settings.isEnabled  Влючен ли игровой объект.
	 * @param {boolean}      settings.isStatic   Должен ли игровой объект быть статичным.
	 * @param {Vector2d}     settings.position   Позиция игрового объекта.
	 * @param {number}       settings.rotation   Угол поворота игрового объекта в радианах.
	 * @param {Vector2d}     settings.scale      Масштаб игрового объекта.
	 * @param {Component[]}  settings.components Компоненты игрового объекта.
	 * @param {GameObject[]} settings.children   Дочерние игровые объекты создаваемоего игрового объекта.
	 */
	constructor({
		name,
		isEnabled = true,
		isStatic = false,
		position = Vector2d.zero,
		rotation = 0,
		scale = new Vector2d(1, 1),
		components = [],
		children = [],
	}) {
		super(isEnabled);
		if (typeof name !== 'string') {
			throw new TypeError('invalid parameter "name". Expected a string.');
		}
		if (name.trim() === '') {
			throw new Error('invalid parameter "name". Expected a non-empty string.');
		}
		if (!Array.isArray(components)) {
			throw new TypeError('invalid parameter "components". Expected an array.');
		}
		if (!Array.isArray(children)) {
			throw new TypeError('invalid parameter "children". Expected an array.');
		}

		this.name = name;
		this.isEnabledInHierarchy = this.isEnabled;
		this.transform = new Transform(isStatic, position, rotation, scale);
		/**
		 * @type {Set<GameObject>}
		 */
		this.children = new Set();
		/**
		 * @type {GameObject}
		 */
		this.parent = null;

		components.forEach(component => this.addComponent(component));
		children.forEach(child => this.addChild(child));
	}

	/**
	 * Служебная функция. Для включения и выключения игрового объекта использовать setEnabled(value).
	 * 
	 * @access protected
	 */
	enable() {
		this.throwIfDestroyed();
		if (!this.isEnabledInHierarchy && (this.parent == null || this.parent.isEnabledInHierarchy)) {
			this.isEnabledInHierarchy = true;
			super.enable();
			if (!this.isActive()) {
				return;
			}
			for (let child of this.children.values()) {
				if (!this.isActive()) {
					return;
				}
				if (child.isEnabled) {
					child.enable();
				}
			}
		}
	}

	/**
	 * Служебная функция. Для включения и выключения игрового объекта использовать setEnabled(value).
	 * 
	 * @access protected
	 */
	disable() {
		this.throwIfDestroyed();
		if (
			this.isEnabledInHierarchy
			&& (
				this.parent == null
				|| !this.parent.isEnabledInHierarchy
				|| !this.isEnabled
			)
		) {
			this.isEnabledInHierarchy = false;
			super.disable();
			if (this.isDestroyed || this.isActive()) {
				return;
			}
			for (let child of this.children.values()) {
				if (this.isDestroyed || this.isActive()) {
					return;
				}
				if (child.isEnabled) {
					child.disable();
				}
			}
			return;
		}
	}

	/**
	 * @return {boolean} Возвращает true, если объект не уничтожен и включен.
	 */
	isActive() {
		return !this.isDestroyed && this.isEnabledInHierarchy;
	}

	/**
	 * Устанавливает родителя для данного игрового объкта.
	 * Можно передать null, чтобы сделать его независимым.
	 * 
	 * @param {GameObject} gameObject Родительский игровой объект. Может быть null.
	 */
	setParent(gameObject) {
		this.throwIfDestroyed();
		if (gameObject == null) {
			if (this.parent != null) {
				this.parent.removeChild(this);
			}
			return;
		}
		if (!(gameObject instanceof GameObject)) {
			throw new TypeError('invalid parameter "gameObject". Expected an instance of GameObject class.');
		}
		gameObject.addChild(this);
	}

	/**
	 * Добавляет дочерний игровой объект.
	 * 
	 * @param {GameObject} gameObject Игровой объект, который станет дочерним.
	 */
	addChild(gameObject) {
		this.throwIfDestroyed();
		if (!(gameObject instanceof GameObject)) {
			throw new TypeError('invalid parameter "gameObject". Expected an instance of GameObject class.');
		}
		if (gameObject.isDestroyed) {
			return;
		}
		if (this.children.has(gameObject)) {
			return;
		}
		if (gameObject.transform.isStatic && !this.transform.isStatic) {
			throw new Error('cannot set a non-static game object as parent in a static game object.');
		}
		if (gameObject.parent != null) {
			gameObject.parent.children.delete(gameObject);
			const previousParentEnabled = gameObject.parent.isEnabledInHierarchy;
			const currentParentEnabled = this.isEnabledInHierarchy;
			gameObject.parent = null;
			if (previousParentEnabled != currentParentEnabled) {
				if (previousParentEnabled && gameObject.isEnabled) {
					gameObject.disable();
				} else if (gameObject.isEnabled) {
					gameObject.enable();
				}
			}
		} else {
			if (this.isEnabledInHierarchy != gameObject.isEnabled && gameObject.isEnabled) {
				gameObject.disable();
			} else if (this.isEnabledInHierarchy && gameObject.isEnabled) {
				if (this.isInitialized && gameObject.scene == null) {
					this.scene.addObject(gameObject);
				}
			}
		}
		if (!gameObject.isDestroyed) {
			this.children.add(gameObject);
			gameObject.parent = this;
		}
	}

	/**
	 * @param {string} name Имя дочернего игрового объекта.
	 * 
	 * @return {GameObject} Возвращает дочерний игровой объект с переданным именем. Если он не нашелся, то возвращается undefined.
	 */
	getChildByName(name) {
		this.throwIfDestroyed();
		if (typeof name !== 'string') {
			throw new TypeError('invalid parameter "name". Expected a string.');
		}
		for (let child of this.children.values()) {
			if (child.name === name) {
				return child;
			}
		}
		return undefined;
	}

	/**
	 * Удаляет дочерний игровой объект из данного игрового объекта.
	 * 
	 * @param {GameObject} child Дочерний объект.
	 */
	removeChild(child) {
		this.throwIfDestroyed();
		if (this.children.has(child)) {
			this.children.delete(child);
			child.parent = null;
			if (child.isDestroyed) {
				return;
			}
			if (this.isEnabledInHierarchy != child.isEnabled && child.isEnabled) {
				child.enable();
			}
		}
	}

	/**
	 * Обновляет все компоненты в данном игровом компоненте.
	 * 
	 * @param {number} fixedDeltaTime Фиксированное время обновления логики игры в секундах.
	 */
	fixedUpdate(fixedDeltaTime) {
		this.throwIfDestroyed();
		this.throwIfNotInitialized();
		this.forEachComponent(component => {
			if (component.isEnabled && component instanceof GameComponent) {
				component.onFixedUpdate(fixedDeltaTime);
			}
		});
	}

	/**
	 * Уничтожает данный игровой объект.
	 */
	destroy() {
		if (this.isDestroyed) {
			return;
		}
		super.destroy();
		this.children.forEach(child => child.destroy());
		delete this.children;
		delete this.transform;
		if (this.parent != null && !this.parent.isDestroyed) {
			this.parent.removeChild(this);
		}
		delete this.parent;
	}
}
