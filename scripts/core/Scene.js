import Resourses from './Resources.js';
import GameObject from './GameObject.js';
import Camera from './graphics/Camera.js';
import Resources from './Resources.js';
import RendererComponent from './graphics/RendererComponent.js';
import ComponentObject from './ComponentObject.js';
import Color from './graphics/Color.js';
import Screen from './graphics/Screen.js';
import HierarchyObject from './HierarchyObject.js';
import UIObject from './ui/UIObject.js';
import Renderer from './graphics/webgl/Renderer.js';

export default class Scene {
	constructor() {
		if (new.target === Scene) {
			throw new TypeError('cannot create instance of abstract class');
		}
		/**
		 * @type {Resources}
		 */
		this.resources = null;
		this.isStarted = false;
		this.isInitialized = false;
		this.isDestroyed = false;
		/**
		 * @type {Set<ComponentObject>}
		 */
		this.enabledObjects = null;
		/**
		 * @type {Set<ComponentObject>}
		 */
		this.objectsBuffer = null;
		/**
		 * @type {Set<ComponentObject>}
		 */
		this.disabledObjects = null;
		/**
		 * @type {Camera}
		 */
		this.camera = null;
	}

	throwIfDestroyed() {
		if (this.isDestroyed) {
			throw new Error('scene is destroyed.');
		}
	}

	throwIfNotInitialized() {
		if (!this.isInitialized) {
			throw new Error('scene is not initialized.');
		}
	}

	/**
	 * Инициализирует сцену.
	 * Здесь происходит загрузка ресурсов.
	 */
	initialize() {
		this.throwIfDestroyed();
		if (this.isInitialized) {
			throw new Error('already initialized.');
		}
		this.resources = new Resourses();
		this.onInitialize();
		this.isInitialized = true;
		this.resources.loadAll(() => {
			this.start();
		});
	}

	/**
	 * Происходит во время инициализации сцены.
	 * Здесь указываются ресурсы, которые надо загрузить.
	 */
	onInitialize() {

	}

	/**
	 * Запускает сцену.
	 */
	start() {
		this.throwIfDestroyed();
		this.throwIfNotInitialized();
		this.enabledObjects = new Set();
		this.objectsBuffer = new Set();
		this.disabledObjects = new Set();
		this.onStart();
		if (this.camera == null) {
			console.warn('there is no camera');
		}
		this.isStarted = true;
	}

	/**
	 * Происходит во время запуска сцены.
	 */
	onStart() {

	}

	/**
	 * Останавливает сцену.
	 */
	stop() {
		if (!this.isStarted) {
			return;
		}
		this.throwIfDestroyed();
		this.throwIfNotInitialized();
		this.onStop();
		this.isStarted = false;
		this.enabledObjects.forEach(componentObject => componentObject.destroy());
		this.objectsBuffer.forEach(componentObject => componentObject.destroy());
		this.disabledObjects.forEach(componentObject => componentObject.destroy());
		this.camera = null;
		this.enabledObjects = null;
		this.objectsBuffer = null;
		this.disabledObjects = null;
	}

	/**
	 * Происходит во время остановки сцены.
	 */
	onStop() {

	}

	/**
	 * Уничтожает сцену.
	 */
	destroy() {
		this.throwIfDestroyed();
		if (!this.isInitialized) {
			return;
		}
		this.stop();
		this.onDestroy();
		this.resources.destroy();
		this.resources = null;
		this.isDestroyed = true;
		if (Scene.current === this) {
			Scene.current = null;
		}
	}

	/**
	 * Происходит во время уничтожения сцены.
	 */
	onDestroy() {

	}

	/**
	 * @param {ComponentObject} componentObject
	 * 
	 * @return {boolean} Возвращает true, если объект содержится на сцене.
	 */
	containsObject(componentObject) {
		this.throwIfDestroyed();
		this.throwIfNotInitialized();
		if (componentObject instanceof Camera) {
			return this.camera == componentObject;
		}
		return this.enabledObjects.has(componentObject)
			|| this.objectsBuffer.has(componentObject)
			|| this.disabledObjects.has(componentObject);
	}

	/**
	 * Добавляет объект на сцену.
	 * 
	 * @param {GameObject} componentObject Объект, который надо добавить.
	 */
	addObject(componentObject) {
		this.throwIfDestroyed();
		this.throwIfNotInitialized();
		if (componentObject instanceof HierarchyObject) {
			if (!this.containsObject(componentObject)) {
				this.objectsBuffer.add(componentObject);
				componentObject.attach(this);
			}
			componentObject.children.forEach(child => this.addObject(child));
		} else if (componentObject instanceof Camera) {
			if (this.camera == componentObject) {
				return;
			}
			if (this.camera != componentObject && this.camera != null) {
				if (!this.camera.isDestroyed) {
					this.camera.destroy();
				}
				this.camera = null;
			}
			this.objectsBuffer.add(componentObject);
			componentObject.attach(this);
			this.camera = componentObject;
		}
	}

	/**
	 * Удаляет передаваемый объект со сцены.
	 * 
	 * @param {ComponentObject} componentObject Объект, который надо удалить.
	 */
	removeObject(componentObject) {
		this.throwIfDestroyed();
		this.throwIfNotInitialized();
		this.enabledObjects.delete(componentObject);
		this.objectsBuffer.delete(componentObject);
		this.disabledObjects.delete(componentObject);
		if (componentObject instanceof Camera) {
			if (this.camera === componentObject) {
				this.camera = null;
			}
		}
		if (!componentObject.isDestroyed) {
			componentObject.destroy();
		}
	}

	/**
	 * @access private
	 */
	processBuffer() {
		if (!this.isStarted) {
			return;
		}
		this.objectsBuffer.forEach(componentObject => {
			if (!this.isStarted) {
				return;
			}
			if (componentObject.isActive()) {
				if (!componentObject.isInitialized) {
					componentObject.initialize();
					if (!componentObject.isActive()) {
						this.disabledObjects.add(componentObject);
						return;
					}
				}
				this.enabledObjects.add(componentObject);
			} else {
				this.disabledObjects.add(componentObject);
			}
		});
		this.objectsBuffer.clear();
	}
	
	/**
	 * Выполняет передаваемую функцию для каждого включенного игрового объекта.
	 * 
	 * @param {(gameObject: GameObject) => void} action Функция, которую надо выполнить для каждого включенного игрового объекта.
	 */
	forEachEnabledGameObject(action) {
		this.throwIfDestroyed();
		this.throwIfNotInitialized();
		this.processBuffer();
		if (!this.isStarted) {
			return;
		}
		this.enabledObjects.forEach(componentObject => {
			if (!this.isStarted) {
				return;
			}
			if (componentObject instanceof GameObject) {
				action(componentObject);
			}
		});
	}

	/**
	 * Выполняет передаваемую функцию для каждого включенного объекта интерфейса.
	 * 
	 * @param {(uiObject: UIObject) => void} action Функция, которую надо выполнить для каждого включенного объекта интерфейса.
	 */
	forEachEnabledUIObject(action) {
		this.throwIfDestroyed();
		this.throwIfNotInitialized();
		this.processBuffer();
		if (!this.isStarted) {
			return;
		}
		this.enabledObjects.forEach(componentObject => {
			if (!this.isStarted) {
				return;
			}
			if (componentObject instanceof UIObject) {
				action(componentObject);
			}
		});
	}

	/**
	 * Обновляет камеру.
	 * 
	 * @param {number} deltaTime Время, которое прошло с прошлого кадра в секундах.
	 */
	updateCamera(deltaTime) {
		this.throwIfDestroyed();
		this.throwIfNotInitialized();
		this.processBuffer();
		if (this.camera != null && this.camera.isActive() && this.isStarted) {
			this.camera.update(deltaTime);
		}
	}

	/**
	 * Отрисовывает все игровые объекты на сцене.
	 */
	draw() {
		this.throwIfDestroyed();
		this.throwIfNotInitialized();
		this.processBuffer();
		if (!this.isStarted) {
			return;
		}
		if (this.camera != null && this.camera.isActive()) {
			const renderers = [];
			for (let componentObject of this.enabledObjects.values()) {
				const renderer = componentObject.getComponent(RendererComponent);
				if (renderer != null) {
					renderers.push(renderer);
				}
			}
			this.camera.draw(renderers.sort((renderer, otherRenderer) => {
				return renderer.layer - otherRenderer.layer;
			}));
		} else {
			const size = Screen.size;
			Renderer.clear(0, 0, size, Color.black);
		}
	}

	/**
	 * Перезагружает сцену.
	 */
	reload() {
		this.throwIfDestroyed();
		this.throwIfNotInitialized();
		this.stop();
		this.start();
	}

	/**
	 * Перезагружает сцену. Все ресурсы заново загружаются.
	 */
	hardReload() {
		Scene.changeScene(this.constructor);
	}

	/**
	 * @type {Scene}
	 */
	static current = null;

	/**
	 * Изменяет текущую сцену.
	 * 
	 * @param {function} sceneClass Класс сцены, которую надо поставить.
	 */
	static changeScene(sceneClass) {
		if (typeof sceneClass !== 'function') {
			throw new TypeError('invalid parameter "sceneClass". Expected a function.');
		}
		let scene = null;
		try {
			scene = Reflect.construct(sceneClass, []);
		} catch {
			throw new Error('invalid parameter "sceneClass". Cannot create instance.');
		}
		if (!(scene instanceof Scene)) {
			throw new TypeError('invalid parameter "scene". Expected an instance of Scene class.');
		}
		if (Scene.current == null) {
			Scene.current = scene;
			Scene.current.initialize();
		} else {
			Scene.current.destroy();
			Scene.current = scene;
			Scene.current.initialize();
		}
	}
}
