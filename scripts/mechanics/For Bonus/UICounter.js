import UIComponent from '../../core/ui/UIComponent.js';
import Volleyball from './Volleyball.js';

export default class UICounter extends UIComponent {
	constructor(ball) {
		super();
		this.ball = ball;
		this.currentScore1 = null;
		this.currentScore2 = null;
	}

	onInitialize() {
		/**
		 * @type {Volleyball}
		 */
		this.volleyball = this.ball.getComponent(Volleyball);
		if (this.volleyball == null) {
			throw new Error('no volleyball.');
		}
	}

	onUpdate() {
		if (this.currentScore1 !== this.volleyball.player1Score || this.currentScore2 !== this.volleyball.player2Score) {
			this.uiObject.setInnerText(`${this.volleyball.player1Score} : ${this.volleyball.player2Score}`);
			this.currentScore1 = this.volleyball.player1Score;
			this.currentScore2 = this.volleyball.player2Score;
		}
	}
}