import Vector2d from './Vector2d.js';
import Component from './Component.js';
import Renderer from './graphics/Renderer.js';

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
		this.isInitialized = false;
		this.isDestroyed = false;
		/**
		 * @type {GameObject[]}
		 */
		this.children = [];
		/**
		 * @type {GameObject}
		 */
		this.parent = null;

		/**
		 * @type {Component[]}
		 * 
		 * @access private
		 */
		this.components = [];
		/**
		 * @access private
		 */
		this.componentsInProcessing = false;
		/**
		 * @access private
		 */
		this.componentRemovedInProcessing = false;
	}

	/**
	 * Выбрасывает ошибку, если игровой объект уничтожен.
	 */
	throwIfDestroyed() {
		if (this.isDestroyed) {
			throw new Error('game object is destroyed.');
		}
	}

	/**
	 * Выбрасывает ошибку, если игровой объект статичный.
	 */
	throwIfStatic() {
		if (this.isStatic) {
			throw new Error('attempt to modify a static game object.');
		}
	}

	/**
	 * Выбрасывает ошибку, если игровой объект еше не инициализирован.
	 */
	throwIfNotInitialized() {
		if (!this.isInitialized) {
			throw new Error('game object is not initialized.');
		}
	}

	/**
	 * Изменяет позицию игрового объекта.
	 * 
	 * @param {Vector2d} position Новая позиция игрового объекта. 
	 */
	setPosition(position) {
		this.throwIfDestroyed();
		this.throwIfStatic();
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
		this.throwIfDestroyed();
		this.throwIfStatic();
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
		this.throwIfDestroyed();
		this.throwIfStatic();
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
		this.throwIfDestroyed();
		this.throwIfStatic();
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
		this.throwIfDestroyed();
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
		this.throwIfDestroyed();
		if (!(component instanceof Component)) {
			throw new TypeError('invalid parameter "component". Expected an instance of Component class.');
		}
		if (this.components.includes(component)) {
			return;
		}
		if (!component.allowMultipleComponents()) {
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
		this.throwIfDestroyed();
		if (typeof componentClass !== 'function') {
			throw new TypeError('invalid parameter "componentClass". Expected a function.');
		}
		return this.components.find(component => !component.isDestroyed && component instanceof componentClass);
	}

	/**
	 * @param {function} componentsClass Класс компонентов, которые надо получить.
	 * 
	 * @return {Component[]} Возвращает массив компонентов, которые принадлежат передаваемому классу. Если таких нет, то возвращается пустой массив.
	 */
	getComponents(componentsClass) {
		this.throwIfDestroyed();
		if (typeof componentsClass !== 'function') {
			throw new TypeError('invalid parameter "componentsClass". Expected a function.');
		}
		return this.components.filter(component => !component.isDestroyed && component instanceof componentsClass);
	}

	/**
	 * @return {number} Возвращает количество компонентов на данном игровом объекте.
	 */
	getComponentsCount() {
		this.throwIfDestroyed();
		return this.components.reduce((accumulator, component) => {
			if (!component.isDestroyed) {
				accumulator++;
			}
			return accumulator;
		}, 0);
	}

	/**
	 * Удаляет первый компонент, который принадлежит передаваемому классу, из данного игрового объекта.
	 * 
	 * @param {function} componentClass Класс компонента, который надо удалить.
	 */
	removeComponentByClass(componentClass) {
		this.throwIfDestroyed();
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
		this.throwIfDestroyed();
		if (typeof componentsClass !== 'function') {
			throw new TypeError('invalid parameter "componentsClass". Expected a function.');
		}
		if (this.componentsInProcessing) {
			this.components.forEach(component => {
				if (!component.isDestroyed && component instanceof componentsClass) {
					component.destroy();
				}
			});
		} else {
			this.components = this.components.filter(component => {
				if (!component.isDestroyed && component instanceof componentsClass) {
					component.destroy();
					return false;
				}
				return true;
			});
		}
	}

	/**
	 * Удаляет компонент из данного игрового объекта.
	 * 
	 * @param {Component} component Компонент, который надо удалить.
	 */
	removeComponent(component) {
		this.throwIfDestroyed();
		if (!(component instanceof Component)) {
			throw new TypeError('invalid parameter "component". Expected an instance of Component class.');
		}
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
		this.throwIfDestroyed();
		if (!Number.isInteger(index)) {
			throw new TypeError('invalid parameter "index". Expected a integer.');
		}
		if (index < 0 || index >= this.components.length) {
			throw new RangeError('invalid parametr "index".');
		}
		if (!this.components[index].isDestroyed) {
			this.components[index].destroy();
		}
		if (!this.componentsInProcessing) {
			this.components.splice(index, 1);
		}
	}

	/**
	 * Удаляет компоненты, которые были уничтожены во время обработки всех компонентов.
	 * 
	 * Если вызов функции произойдет, когда компоненты еще обрабатываются, то удаления уничтоженных компонентов не будет выполнено.
	 * Однако этот вызов скажет игровому объекту, что во время обработки компонентов было удаление.
	 */
	removeDestroyedComponents() {
		if (this.componentsInProcessing) {
			this.componentRemovedInProcessing = true;
		} else if (this.componentRemovedInProcessing) {
			this.components = this.components.filter(component => !component.isDestroyed);
			this.componentRemovedInProcessing = false;
		}
	}

	/**
	 * Вызывает функцию во всех компонентах данного игрового объекта с помощью класса Reflect.
	 * 
	 * @param {string} functionName Название функции, которую надо вызвать.
	 * @param {...any} args         Агрументы, которые надо передать в функцию.
	 */
	callInComponents(functionName, ...args) {
		this.throwIfDestroyed();
		const isMainProcess = !this.componentsInProcessing;
		this.componentsInProcessing = true;

		this.components.forEach(component => {
			if (component.isDestroyed || !component.isEnabled) {
				return;
			}
			const componentFunction = component[functionName];
			if (componentFunction != null && typeof componentFunction === 'function') {
				Reflect.apply(componentFunction, component, args);
			}
		});

		if (isMainProcess) {
			this.componentsInProcessing = false;
			this.removeDestroyedComponents();
		}
	}

	/**
	 * Инициализирует данный игровой объект.
	 */
	initialize() {
		this.throwIfDestroyed();
		if (this.isInitialized) {
			throw new Error('already initialized.');
		}
		this.isInitialized = true;
		this.componentsInProcessing = true;

		this.components.forEach(component => component.initialize());

		this.componentsInProcessing = false;
		this.removeDestroyedComponents();
	}

	/**
	 * Вызывается перед обновлением физики.
	 * 
	 * @param {number} fixedDeltaTime Фиксированное время обновления физики в секундах.
	 */
	onPhysicsUpdate(fixedDeltaTime) {
		this.throwIfDestroyed();
		this.throwIfNotInitialized();
		this.callInComponents('onPhysicsUpdate', fixedDeltaTime);
	}

	/**
	 * Вызывается во время каждого кадра.
	 * 
	 * @param {number} deltaTime Время, которое прошло с прошлого кадра в миллисекундах.
	 */
	onFrameUpdate(deltaTime) {
		this.throwIfDestroyed();
		this.throwIfNotInitialized();
		this.callInComponents('onFrameUpdate', deltaTime);
	}

	/**
	 * Вызывается во время каждого кадра в конце.
	 * 
	 * @param {number} deltaTime Время, которое прошло с прошлого кадра в миллисекундах.
	 */
	onFrameUpdateEnd(deltaTime) {
		this.throwIfDestroyed();
		this.throwIfNotInitialized();
		this.callInComponents('onFrameUpdateEnd', deltaTime);
	}

	/**
	 * Вызывается, когда надо отрисовать игровой объект.
	 * 
	 * @param {CanvasRenderingContext2D} context Контекст, в котором будет происходить отрисовка. 
	 */
	onDraw(context) {
		this.throwIfDestroyed();
		this.throwIfNotInitialized();
		this.componentsInProcessing = true;

		this.components.forEach(component => {
			if (!component.isDestroyed && component.isEnabled && component instanceof Renderer) {
				component.onDraw(context);
			}
		});

		this.componentsInProcessing = false;
		this.removeDestroyedComponents();
	}

	/**
	 * Уничтожает данный игровой объект.
	 */
	destroy() {
		this.throwIfDestroyed();
		this.components.forEach(component => component.destroy());
		this.children.forEach(child => child.destroy());
		delete this.children;
		delete this.components;
		this.isDestroyed = true;
	}
}
