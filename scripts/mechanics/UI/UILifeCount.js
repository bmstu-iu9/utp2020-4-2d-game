import UIComponent from '../../core/ui/UIComponent.js';
import Player from '../Player.js';

export default class UILifeCount extends UIComponent {
	constructor(hero) {
		super();
		this.hero = hero;
		this.currentValue = null;
	}

	onInitialize() {
		this.player = this.hero.getComponent(Player);
	}

	onUpdate() {
		if (this.currentValue !== this.player.lifeCount) {
			this.uiObject.setInnerText(`${this.player.lifeCount}`);
			this.currentValue = this.player.lifeCount;
		}
	}
}