import * as CORE from '../core/Core.js';

export default class Resizer extends CORE.CameraComponent {
	constructor() {
		super();
		this.size = new CORE.Vector2d(document.body.clientWidth, document.body.clientHeight);
		CORE.Screen.setSize(this.size);
	}
	
	onUpdate() {
		if (!this.size.equals(CORE.Screen.size)) {
			this.size = CORE.Screen.size;
			this.camera.setProjection(this.size.x, this.size.y, this.camera.zoom);
		}
		
		const size = new CORE.Vector2d(document.body.clientWidth, document.body.clientHeight);
		CORE.Screen.setSize(size);
		console.log(CORE.Renderer.drawCalls)
	}
}