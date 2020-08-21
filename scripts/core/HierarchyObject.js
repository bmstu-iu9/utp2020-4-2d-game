import ComponentObject from './ComponentObject.js';

export default class HierarchyObject extends ComponentObject {
	/**
	 * @param {boolean} isEnabled Включен ли объект.
	 */
	constructor(isEnabled) {
		if (new.target === HierarchyObject) {
			throw new TypeError('cannot create instance of abstract class.');
		}
		super(isEnabled);
		this.isEnabledInHierarchy = this.isEnabled;

		/**
		 * @type {Set<HierarchyObject>}
		 */
		this.children = new Set();
		/**
		 * @type {HierarchyObject}
		 */
		this.parent = null;
	}

	/**
	 * Служебная функция. Для включения и выключения объекта использовать setEnabled(value).
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
	 * Служебная функция. Для включения и выключения объекта использовать setEnabled(value).
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
	 * Устанавливает родителя для данного объкта.
	 * Можно передать null, чтобы сделать его независимым.
	 * 
	 * @param {HierarchyObject} hierarchyObject Родительский объект. Может быть null.
	 */
	setParent(hierarchyObject) {
		this.throwIfDestroyed();
		if (hierarchyObject == null) {
			if (this.parent != null) {
				this.parent.removeChild(this);
			}
			return;
		}
		if (!(hierarchyObject instanceof HierarchyObject)) {
			throw new TypeError('invalid parameter "hierarchyObject". Expected an instance of HierarchyObject class.');
		}
		if (hierarchyObject.isDestroyed) {
			return;
		}
		hierarchyObject.addChild(this);
	}

	/**
	 * Добавляет дочерний объект.
	 * 
	 * @param {HierarchyObject} hierarchyObject Объект, который станет дочерним.
	 * 
	 * @return {boolean} Возвращает true, если объект стал дочерним.
	 */
	addChild(hierarchyObject) {
		this.throwIfDestroyed();
		if (!(hierarchyObject instanceof HierarchyObject)) {
			throw new TypeError('invalid parameter "hierarchyObject". Expected an instance of HierarchyObject class.');
		}
		if (hierarchyObject.isDestroyed) {
			return false;
		}
		if (this.children.has(hierarchyObject)) {
			return false;
		}
		if (hierarchyObject.parent != null) {
			hierarchyObject.parent.children.delete(hierarchyObject);
			const previousParentEnabled = hierarchyObject.parent.isEnabledInHierarchy;
			const currentParentEnabled = this.isEnabledInHierarchy;
			hierarchyObject.parent = null;
			if (previousParentEnabled != currentParentEnabled) {
				if (previousParentEnabled && hierarchyObject.isEnabled) {
					hierarchyObject.disable();
				} else if (hierarchyObject.isEnabled) {
					hierarchyObject.enable();
				}
			}
		} else {
			if (this.isEnabledInHierarchy != hierarchyObject.isEnabled && hierarchyObject.isEnabled) {
				hierarchyObject.disable();
			} else if (this.isEnabledInHierarchy && hierarchyObject.isEnabled) {
				if (this.scene != null && hierarchyObject.scene == null) {
					this.scene.addObject(hierarchyObject);
				}
			}
		}
		if (!hierarchyObject.isDestroyed) {
			this.children.add(hierarchyObject);
			hierarchyObject.parent = this;
			return true;
		}
		return false;
	}

	/**
	 * @param {string} name Имя дочернего объекта.
	 * 
	 * @return {HierarchyObject} Возвращает дочерний объект с переданным именем. Если он не нашелся, то возвращается undefined.
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
	 * Удаляет дочерний объект из данного объекта.
	 * 
	 * @param {HierarchyObject} child Дочерний объект.
	 * 
	 * @return {boolean} Возвращает true, если дочерний объект был удален.
	 */
	removeChild(child) {
		this.throwIfDestroyed();
		if (this.children.has(child)) {
			this.children.delete(child);
			child.parent = null;
			if (child.isDestroyed) {
				return false;
			}
			if (this.isEnabledInHierarchy != child.isEnabled && child.isEnabled) {
				child.enable();
			}
			return true;
		}
		return false;
	}

	/**
	 * Уничтожает данный объект.
	 */
	destroy() {
		if (this.isDestroyed) {
			return;
		}
		super.destroy();
		this.children.forEach(child => child.destroy());
		delete this.children;
		if (this.parent != null && !this.parent.isDestroyed) {
			this.parent.removeChild(this);
		}
		delete this.parent;
	}
}
