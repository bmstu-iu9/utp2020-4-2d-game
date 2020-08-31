import UIComponent from '../../core/ui/UIComponent.js';

export default class UIAudioButton extends UIComponent {
	onInitialize() {
		const component = this;
		this.uiObject.addEventListener('click', () => {
			if (document.getElementById(`audio`).style.display == 'none') {
				document.getElementById(`about`).style.display = 'none';
				document.getElementById(`audio`).style.display = 'flex';
			}
		});
	}
}