import GameComponent from '../core/GameComponent.js';
import Collector from './Collector.js';
import Input from '../core/Input.js';
import Scene from '../core/Scene.js';

export default class Door extends GameComponent {
	constructor(nextLevel, hero) {
		super();
		this.nextLevel = nextLevel;
		this.collector = hero.getComponent(Collector);
		this.heroInDoor = false;
	}

	onTriggerEnter(collider) {
		if (collider.isActive() && collider.gameObject.name === 'hero') {
			this.heroInDoor = true;	
		}
	}

	onTriggerExit(collider) {
		if (collider.isActive() && collider.gameObject.name === 'hero') {
			this.heroInDoor = false;
		}
	}

	onUpdate() {
		if (this.heroInDoor && Input.getKeyDown('KeyE') && this.collector.coinsCount === 5) {
			Scene.changeScene(this.nextLevel);
		}
	}
}