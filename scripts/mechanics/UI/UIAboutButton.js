import UIComponent from '../../core/ui/UIComponent.js';

export default class UIAboutButton extends UIComponent {
	onInitialize() {
		const component = this;
		this.uiObject.addEventListener('click', () => {
			if (document.getElementById(`about`).style.display == 'none') {
				document.getElementById(`audio`).style.display = 'none';
				document.getElementById(`about`).style.display = 'block';
			}
		});
	}
}