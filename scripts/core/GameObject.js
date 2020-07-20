import Vector2d from './Vector2d.js';
import ComponentObject from './ComponentObject.js';
import Renderer from './graphics/Renderer.js';
import Transform from './Transform.js';

export default class GameObject extends ComponentObject {
	/**
	 * @param {string}   name     Имя игрового объекта.
	 * @param {boolean}  isStatic Должен ли игровой объект быть статичным.
	 * @param {Vector2d} position Позиция игрового объекта.
	 * @param {number}   rotation Угол поворота игрового объекта в радианах.
	 * @param {Vector2d} scale    Масштаб игрового объекта.
	 */
	constructor(name, isStatic = false, position = Vector2d.zero, rotation = 0, scale = new Vector2d(1, 1)) {
		super();
		if (typeof name !== 'string') {
			throw new TypeError('invalid parameter "name". Expected a string.');
		}
		if (name.trim() === '') {
			throw new Error('invalid parameter "name". Expected a non-empty string.');
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
		super.destroy();
		this.children.forEach(child => child.destroy());
		delete this.children;
		delete this.transform;
	}
}
