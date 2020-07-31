import Vector2d from './Vector2d.js';
import ComponentObject from './ComponentObject.js';
import Renderer from './graphics/Renderer.js';
import Transform from './Transform.js';
import Component from './Component.js';
import Camera from './graphics/Camera.js';
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
		this.transform = new Transform(isStatic, position, rotation, scale);
		/**
		 * @type {GameObject[]}
		 */
		this.children = [];
		/**
		 * @type {GameObject}
		 */
		this.parent = null;

		components.forEach(component => this.addComponent(component));
		children.forEach(child => this.addChild(child));
	}

	/**
	 * Влючает или выключает игровой объект.
	 * 
	 * @param {boolean} value Должен ли игровой объект включиться.
	 */
	setEnabled(value) {
		super.setEnabled(value);
		if (value && !this.isInitialized && this.isEnabledInHierarchy()) {
			this.initialize();
			this.children.forEach(child => child.isEnabled && child.enable());
		}
	}

	/**
	 * Служебная функция. Для включения и выключения игрового объекта использовать setEnabled(value).
	 * 
	 * @access protected
	 */
	enable() {
		this.throwIfDestroyed();
		if (this.parent != null && !this.parent.isEnabledInHierarchy()) {
			return;
		}
		if (!this.isInitialized) {
			this.initialize();
			this.children.forEach(child => child.isEnabled && child.enable());
			return;
		}
		super.enable();
		this.children.forEach(child => child.isEnabled && child.enable());
	}

	/**
	 * Служебная функция. Для включения и выключения игрового объекта использовать setEnabled(value).
	 * 
	 * @access protected
	 */
	disable() {
		this.throwIfDestroyed();
		if (!this.isInitialized) {
			return;
		}
		if (this.parent != null && !this.parent.isEnabledInHierarchy()) {
			return;
		}
		super.disable();
		this.children.forEach(child => child.isEnabled && child.disable());
	}

	/**
	 * @return {boolean} Возвращает true, если объект включен в иерархии.
	 */
	isEnabledInHierarchy() {
		let gameObject = this;
		while (gameObject != null) {
			if (!gameObject.isEnabled) {
				return false;
			}
			gameObject = gameObject.parent;
		}
		return true;
	}

	/**
	 * @return {boolean} Возвращает true, если объект не уничтожен и включен.
	 */
	isActive() {
		return !this.isDestroyed && this.isEnabledInHierarchy();
	}

	initialize() {
		if (!this.isEnabledInHierarchy()) {
			return;
		}
		super.initialize();
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
		if (this.transform.isStatic && !gameObject.transform.isStatic) {
			throw new Error('cannot set a non-static game object as parent in a static game object.');
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
		if (this.getChildByName(gameObject.name) == null) {
			if (gameObject.transform.isStatic && !this.transform.isStatic) {
				throw new Error('cannot set a non-static game object as parent in a static game object.');
			}
			this.children.push(gameObject);
			if (gameObject.parent != null) {
				const index = gameObject.parent.children.indexOf(gameObject);
				if (index >= 0) {
					gameObject.parent.children.splice(index, 1);
				}
				const previousParentEnabled = gameObject.parent.isEnabledInHierarchy();
				const currentParentEnabled = this.isEnabledInHierarchy();
				gameObject.parent = null;
				if (previousParentEnabled != currentParentEnabled) {
					if (previousParentEnabled && gameObject.isEnabled) {
						gameObject.disable();
					} else if (gameObject.isEnabled) {
						gameObject.enable();
					}
				}
			} else {
				if (this.isEnabledInHierarchy() != gameObject.isEnabled && gameObject.isEnabled) {
					gameObject.disable();
				}
			}
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
		return this.children.find(child => child.name === name);
	}

	/**
	 * @param {number} index Индекс дочернего игрового объекта.
	 * 
	 * @return {GameObject} Возвращает дочерний игровой объект по индексу.
	 */
	getChildByIndex(index) {
		this.throwIfDestroyed();
		if (!Number.isInteger(index)) {
			throw new TypeError('invalid parameter "index". Expected a integer.');
		}
		if (index < 0 || index >= this.children.length) {
			throw new RangeError('invalid parameter "index".');
		}
		return this.children[index];
	}

	/**
	 * Удаляет дочерний игровой объект из данного игрового объекта.
	 * 
	 * @param {GameObject} child Дочерний объект.
	 */
	removeChild(child) {
		this.throwIfDestroyed();
		const index = this.children.indexOf(child);
		if (index >= 0) {
			this.removeChildAt(index);
		}
	}

	/**
	 * Удаляет дочерний игровой объект из данного игрового объекта по индексу.
	 * 
	 * @param {number} index Индекс дочернего объекта.
	 */
	removeChildAt(index) {
		this.throwIfDestroyed();
		if (!Number.isInteger(index)) {
			throw new TypeError('invalid parameter "index". Expected a integer.');
		}
		if (index < 0 || index >= this.children.length) {
			throw new RangeError('invalid parametr "index".');
		}
		const [deleted] = this.children.splice(index, 1);
		deleted.parent = null;
		if (this.isEnabledInHierarchy() != deleted.isEnabled && deleted.isEnabled) {
			deleted.enable();
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
	 * Отрисовывает данный игровой объект.
	 * 
	 * @param {Camera}                   camera  Камера, в которой будет происходить отрисовка.
	 * @param {CanvasRenderingContext2D} context Контекст, в котором будет происходить отрисовка.
	 */
	draw(camera, context) {
		this.throwIfDestroyed();
		this.throwIfNotInitialized();
		const renderer = this.getComponent(Renderer);
		if (renderer != null && renderer.isActive()) {
			renderer.draw(camera, context);
		}
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
		if (this.parent != null) {
			this.parent.removeChild(this);
			delete this.parent;
		}
	}
}
