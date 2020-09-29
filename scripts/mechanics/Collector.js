import GameComponent from '../core/GameComponent.js';

export default class Collector extends GameComponent {
	constructor() {
		super();
		this.coinsCount = 0;
	}

	onTriggerEnter(collider) {
		if (collider.gameObject.name === 'coin') {
			this.coinsCount++;
			collider.gameObject.destroy();
		}
	}
}