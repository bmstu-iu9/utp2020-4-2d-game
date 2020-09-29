import UIComponent from '../../core/ui/UIComponent.js';
import Collector from '../Collector.js';

export default class UICoinsCount extends UIComponent {
	constructor(hero) {
		super();
		this.hero = hero;
		this.currentValue = null;
	}

	onInitialize() {
		this.collector = this.hero.getComponent(Collector);
	}

	onUpdate() {
		if (this.currentValue !== this.collector.coinsCount) {
			this.uiObject.setInnerText(`${this.collector.coinsCount}`);
			this.currentValue = this.collector.coinsCount;
		}
	}
}