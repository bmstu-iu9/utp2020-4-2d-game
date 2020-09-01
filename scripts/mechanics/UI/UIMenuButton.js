import UIComponent from '../../core/ui/UIComponent.js';

export default class UIMenuButton extends UIComponent {
	onInitialize() {
		const component = this;
		this.uiObject.addEventListener('click', () => {
			if (component.uiObject.htmlObject.style.display == 'flex') {
				document.getElementById(`countsContainer`).style.display = 'none';
				component.uiObject.htmlObject.style.display = 'none';
				document.getElementById(`menu`).style.display = 'flex';
			}
		});
	}
}