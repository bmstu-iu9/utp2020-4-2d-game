import * as CORE from '../core/Core.js';
import Level01 from './Level01.js';
import Level02 from './Level02.js';
import Level03 from './Level03.js';
import Level04 from './Level04.js';
import Level05 from './Level05.js';

class UILevelButton extends CORE.UIComponent {
	constructor(level, id) {
		super();
		this.level = level;
		this.id = id;
	}
	onInitialize() {
		const component = this;
		switch(component.id) {
			case 'level01':
				this.uiObject.addEventListener('click', () => {
					CORE.Scene.changeScene(component.level);
				});
				break;
			case 'level02':
				this.uiObject.addEventListener('click', () => {
					CORE.Scene.changeScene(component.level);
				});
				break;
			case 'level03':
				this.uiObject.addEventListener('click', () => {
					CORE.Scene.changeScene(component.level);
				});
				break;
			case 'level04':
				this.uiObject.addEventListener('click', () => {
					CORE.Scene.changeScene(component.level);
				});
				break;
			case 'level05':
				this.uiObject.addEventListener('click', () => {
					CORE.Scene.changeScene(component.level);
				});
				break;
		}
	}
}

export default class MainMenu extends CORE.Scene {
	onStart() {
		CORE.Screen.setSize(new CORE.Vector2d(1280, 720));
		const ui = new CORE.UIObject({id: 'ui', tag: 'div'});
		this.addObject(ui);
		ui.addChild(new CORE.UIObject({
			tag: 'div',
			id: 'mainMenu',
			children: [
				new CORE.UIObject({
					tag: 'div',
					name: 'level01',
					children: [
						new CORE.UIObject({
							tag: 'button',
							id: 'level01Button',
							innerText: 'Уровень 1',
							components: [
								new UILevelButton(Level01, 'level01'),
							],
						}),	
					],
				}),
				new CORE.UIObject({
					tag: 'div',
					id: 'level02',
					children: [
						new CORE.UIObject({
							tag: 'button',
							id: 'level02Button',
							innerText: 'Уровень 2',
							components: [
								new UILevelButton(Level02, 'level02'),
							],
						}),
					],
				}),
				new CORE.UIObject({
					tag: 'div',
					id: 'level03',
					children: [
						new CORE.UIObject({
							tag: 'button',
							innerText: 'Уровень 3',
							id: 'level03Button',
							components: [
								new UILevelButton(Level03, 'level03'),
							],
						}),
					],
				}),
				new CORE.UIObject({
					tag: 'div',
					id: 'level04',
					children: [
						new CORE.UIObject({
							tag: 'button',
							innerText: 'Уровень 4',
							id: 'level04Button',
							components: [
								new UILevelButton(Level04, 'level04'),
							],
						}),
					],
				}),
				new CORE.UIObject({
					tag: 'div',
					id: 'level05',
					children: [
						new CORE.UIObject({
							tag: 'button',
							innerText: 'Уровень 5',
							id: 'level05Button',
							components: [
								new UILevelButton(Level04, 'level05'),
							],
						}),
					],
				}),
			],
		}));
	}
}