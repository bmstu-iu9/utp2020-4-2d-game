import Vector2d from './mathematics/Vector2d.js';
import Component from './Component.js';
import GameComponent from './GameComponent.js';
import HierarchyObject from './HierarchyObject.js';
import HierarchyTransform from './mathematics/HierarchyTransform.js';

export default class GameObject extends HierarchyObject {
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
		this.transform = new HierarchyTransform(this, isStatic, position, rotation, scale);
		/**
		 * @type {Set<GameObject>}
		 */
		this.children;
		/**
		 * @type {GameObject}
		 */
		this.parent;

		components.forEach(component => this.addComponent(component));
		children.forEach(child => this.addChild(child));
	}

	/**
	 * Устанавливает родителя для данного игрового объкта.
	 * Можно передать null, чтобы сделать его независимым.
	 * 
	 * @param {GameObject} gameObject Родительский игровой объект. Может быть null.
	 */
	setParent(gameObject) {
		if (gameObject == null) {
			super.setParent(null);
			return;
		}
		if (!(gameObject instanceof GameObject)) {
			throw new TypeError('invalid parameter "gameObject". Expected an instance of GameObject class.');
		}
		if (gameObject.isDestroyed) {
			return;
		}
		super.setParent(gameObject);
	}

	/**
	 * Добавляет дочерний игровой объект.
	 * 
	 * @param {GameObject} gameObject Игровой объект, который станет дочерним.
	 * 
	 * @return {boolean} Возвращает true, если игровой объект стал дочерним.
	 */
	addChild(gameObject) {
		if (!(gameObject instanceof GameObject)) {
			throw new TypeError('invalid parameter "gameObject". Expected an instance of GameObject class.');
		}
		if (gameObject.isDestroyed) {
			return;
		}
		if (gameObject.transform.isStatic && !this.transform.isStatic) {
			throw new Error('cannot set a non-static game object as parent in a static game object.');
		}
		if (super.addChild(gameObject)) {
			gameObject.transform.updateMatrices(true);
			return true;
		} else {
			return false;
		}
	}

	/**
	 * @param {string} name Имя дочернего игрового объекта.
	 * 
	 * @return {GameObject} Возвращает дочерний игровой объект с переданным именем. Если он не нашелся, то возвращается undefined.
	 */
	getChildByName(name) {
		return super.getChildByName(name);
	}

	/**
	 * Удаляет дочерний игровой объект из данного игрового объекта.
	 * 
	 * @param {GameObject} child Дочерний игровой объект.
	 * 
	 * @return {boolean} Возвращает true, если дочерний игровой объект был удален.
	 */
	removeChild(child) {
		if (super.removeChild(child)) {
			child.transform.updateMatrices(true);
			return true;
		} else {
			return false;
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
		delete this.transform;
	}
}
