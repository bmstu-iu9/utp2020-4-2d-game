import TransformComponent from '../TransformComponent.js';
import Camera from './Camera.js';

export default class CameraComponent extends TransformComponent {
	constructor() {
		if (new.target === CameraComponent) {
			throw new TypeError('cannot create instance of abstract class.');
		}
		super();
		/**
		 * @type {Camera}
		 */
		this.camera = null;
	}

	destroy() {
		super.destroy();
		this.camera = null;
	}

	attach(camera) {
		super.attach(camera);
		if (!(camera instanceof Camera)) {
			throw new TypeError('invalid parameter "camera". Expected an instance of Camera class.');
		}
		this.camera = camera;
	}
}
