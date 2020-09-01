import UIComponent from '../../core/ui/UIComponent.js';

export default class UICloseButton extends UIComponent {
	onInitialize() {
		const component = this;
		this.uiObject.addEventListener('click', () => {
			if (document.getElementById(`menu`).style.display == 'flex') {
				document.getElementById(`menu`).style.display = 'none';
				document.getElementById(`countsContainer`).style.display = 'flex';
				document.getElementById(`menuButton`).style.display = 'flex';
			}
		});
	}
}