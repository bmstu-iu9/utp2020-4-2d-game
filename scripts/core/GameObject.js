import Vector2d from './Vector2d.js';
import Component from './Component.js';

export default class GameObject {
	/**
	 * @param {string}   name     Имя игрового объекта.
	 * @param {boolean}  isStatic Должен ли игровой объект быть статичным.
	 * @param {Vector2d} position Позиция игрового объекта.
	 * @param {number}   rotation Угол поворота игрового объекта в радианах.
	 * @param {Vector2d} scale    Масштаб игрового объекта.
	 */
	constructor(name, isStatic = false, position = Vector2d.zero, rotation = 0, scale = new Vector2d(1, 1)) {
		if (typeof name !== 'string') {
			throw new TypeError('invalid parameter "name". Expected a string.');
		}
		if (name.trim() === '') {
			throw new Error('invalid parameter "name". Expected a non-empty string.');
		}
		if (typeof isStatic !== 'boolean') {
			throw new TypeError('invalid parameter "isStatic". Expected a boolean value.');
		}

		this.name = name;
		this.setPosition(position);
		this.setRotation(rotation);
		this.setScale(scale);
		this.isStatic = isStatic;
		/**
		 * @type {Component[]}
		 */
		this.components = [];
		/**
		 * @type {GameObject[]}
		 */
		this.children = [];
		/**
		 * @type {GameObject}
		 */
		this.parent = null;
		this.isInitialized = false;
		this.isDestroyed = false;
	}

	/**
	 * Изменяет позицию игрового объекта.
	 * 
	 * @param {Vector2d} position Новая позиция игрового объекта. 
	 */
	setPosition(position) {
		if (this.isStatic) {
			throw new Error('attempt to modify a static gameobject.');
		}
		if (!(position instanceof Vector2d)) {
			throw new TypeError('invalid parameter "position". Expected an instance of Vector2d class.');
		}
		this.position = position.copy();
	}

	/**
	 * Изменяет угол поворота игрового объекта.
	 * 
	 * @param {number} angle Новый угол поворота игрового объекта в радианах. 
	 */
	setRotation(angle) {
		if (this.isStatic) {
			throw new Error('attempt to modify a static gameobject.');
		}
		if (typeof angle !== 'number') {
			throw new TypeError('invalid parameter "angle". Expected a number.');
		}
		this.rotation = angle;
	}

	/**
	 * Изменяет масштаб игрового объекта.
	 * 
	 * @param {Vector2d} scale Новый масштаб игрового объекта. 
	 */
	setScale(scale) {
		if (this.isStatic) {
			throw new Error('attempt to modify a static gameobject.');
		}
		if (!(scale instanceof Vector2d)) {
			throw new TypeError('invalid parameter "scale". Expected an instance of Vector2d class.');
		}
		this.scale = scale.copy();
	}

	/**
	 * Устанавливает родителя для данного игрового объкта.
	 * Можно передать null, чтобы сделать его независимым. 
	 * 
	 * @param {GameObject} gameObject Родительский игровой объект. Может быть null.
	 */
	setParent(gameObject) {
		if (this.isStatic) {
			throw new Error('attempt to modify a static gameobject.');
		}
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
		if (!(gameObject instanceof GameObject)) {
			throw new TypeError('invalid parameter "gameObject". Expected an instance of GameObject class.');
		}
		if (this.getChildByName(gameObject.name) == null) {
			this.children.push(gameObject);
			if (gameObject.parent != null) {
				gameObject.parent.removeChild(gameObject);
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
		const index = this.children.indexOf(child);
		if (index >= 0) {
			const [deleted] = this.children.splice(index, 1);
			deleted.parent = null;
		}
	}

	/**
	 * Удаляет дочерний игровой объект из данного игрового объекта по индексу.
	 * 
	 * @param {number} index Индекс дочернего объекта.
	 */
	removeChildAt(index) {
		if (!Number.isInteger(index)) {
			throw new TypeError('invalid parameter "index". Expected a integer.');
		}
		if (index < 0 || index >= this.children.length) {
			throw new RangeError('invalid parametr "index".');
		}
		const [deleted] = this.children.splice(index, 1);
		deleted.parent = null;
	}

	/**
	 * Добавляет компонент к игровому объекту.
	 * 
	 * @param {Component} component Компонент, который надо добавить.
	 */
	addComponent(component) {
		if (!(component instanceof Component)) {
			throw new TypeError('invalid parameter "component". Expected an instance of Component class.');
		}
		if (this.components.includes(component)) {
			return;
		}
		if (!component.allowMultipleComponents) {
			const componentConstructor = Object.getPrototypeOf(component).constructor;
			if (this.getComponent(componentConstructor) != null) {
				const message = `adding multiple instances of "${componentConstructor.name}" component is disallowed.`;
				throw new Error(message);
			}
		}
		component.attach(this);
		this.components.push(component);
		if (this.isInitialized) {
			component.initialize();
		}
	}

	/**
	 * @param {function} componentClass Класс компонента, который надо получить.
	 * 
	 * @return {Component} Возвращает первый компонент, который принадлежит передаваемому классу. Если такого нет, то возвращается undefined.
	 */
	getComponent(componentClass) {
		if (typeof componentClass !== 'function') {
			throw new TypeError('invalid parameter "componentClass". Expected a function.');
		}
		return this.components.find(component => component instanceof componentClass);
	}
	
	/**
	 * @param {function} componentsClass Класс компонентов, которые надо получить.
	 * 
	 * @return {Component[]} Возвращает массив компонентов, которые принадлежат передаваемому классу. Если таких нет, то возвращается пустой массив.
	 */
	getComponents(componentsClass) {
		if (typeof componentsClass !== 'function') {
			throw new TypeError('invalid parameter "componentsClass". Expected a function.');
		}
		return this.components.filter(component => component instanceof componentsClass);
	}

	/**
	 * Удаляет первый компонент, который принадлежит передаваемому классу, из данного игрового объекта.
	 * 
	 * @param {function} componentClass Класс компонента, который надо удалить.
	 */
	removeComponentByClass(componentClass) {
		if (typeof componentClass !== 'function') {
			throw new TypeError('invalid parameter "componentClass". Expected a function.');
		}
		const index = this.components.findIndex(component => component instanceof componentClass);
		if (index >= 0) {
			this.removeComponentAt(index);
		}
	}

	/**
	 * Удаляет компоненты, которые принадлежат передаваемому классу, из данного игрового объекта.
	 * 
	 * @param {function} componentsClass Класс компонентов, которые надо удалить.
	 */
	removeComponentsByClass(componentsClass) {
		if (typeof componentsClass !== 'function') {
			throw new TypeError('invalid parameter "componentsClass". Expected a function.');
		}
		let i = 0;
		while (i < this.components.length) {
			if (this.components[i] instanceof componentsClass) {
				this.removeComponentAt(i);
			} else {
				i++;
			}
		}
	}

	/**
	 * Удаляет компонент из данного игрового объекта.
	 * 
	 * @param {Component} component Компонент, который надо удалить.
	 */
	removeComponent(component) {
		const index = this.components.indexOf(component);
		if (index >= 0) {
			this.removeComponentAt(index);
		}
	}

	/**
	 * Удаляет компонент из данного игрового объекта по индексу.
	 * 
	 * @param {number} index Индекс компонента, который нужно удалить.
	 */
	removeComponentAt(index) {
		if (!Number.isInteger(index)) {
			throw new TypeError('invalid parameter "index". Expected a integer.');
		}
		if (index < 0 || index >= this.components.length) {
			throw new RangeError('invalid parametr "index".');
		}
		const [deleted] = this.components.splice(index, 1);
		deleted.destroy();
	}

	/**
	 * Вызывает функцию во всех компонентах данного игрового объекта с помощью класса Reflect.
	 * 
	 * @param {string} functionName Название функции, которую надо вызвать.
	 * @param {...any} args         Агрументы, которые надо передать в функцию.
	 */
	callInComponents(functionName, ...args) {
		this.components.forEach(component => {
			if (!component.isEnabled) {
				return;
			}
			const componentFunction = component[functionName];
			if (componentFunction != null && typeof componentFunction === 'function') {
				Reflect.apply(componentFunction, component, args);
			}
		});
	}

	/**
	 * Инициализирует данный игровой объект.
	 */
	initialize() {
		if (this.isInitialized) {
			throw new Error('already initialized.');
		}
		this.isInitialized = true;
		this.components.forEach(component => component.initialize());
	}

	/**
	 * Вызывается во время каждого кадра.
	 * 
	 * @param {number} deltaTime Время, которое прошло с прошлого кадра в миллисекундах.
	 */
	onFrameUpdate(deltaTime) {
		this.callInComponents('onFrameUpdate', deltaTime);
	}

	/**
	 * Вызывается во время каждого кадра в конце.
	 * 
	 * @param {number} deltaTime Время, которое прошло с прошлого кадра в миллисекундах.
	 */
	onFrameUpdateEnd(deltaTime) {
		this.callInComponents('onFrameUpdateEnd', deltaTime);
	}

	/**
	 * Отрисовывает данный игровой объект в передаваемом контексте.
	 * 
	 * @param {CanvasRenderingContext2D} context Контекст, в котором будет происходить отрисовка. 
	 */
	draw(context) {
	}

	/**
	 * Уничтожает данный игровой объект.
	 */
	destroy() {
		while (this.components.length != 0) {
			this.components[0].destroy();
		}
		this.isDestroyed = true;
	}
}