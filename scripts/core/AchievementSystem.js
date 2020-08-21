import Maths from './mathematics/Maths.js';

const achievementSystemID = '__achievement_system__';

export default class AchievementSystem {
	/**
	 * @return {Object<string, {name: string, progress: number, goal: number}>} Возвращает все достижения, которые есть в системе.
	 */
	static getAchievements() {
		const achievements = localStorage[achievementSystemID];
		return achievements == null ? {} : JSON.parse(achievements);
	}

	/**
	 * Добавляет достижение в систему.
	 *
	 * @param {{id: string, name: string, goal: number}} achievement Достижение, которое надо добавить.
	 */
	static add(achievement) {
		if (typeof achievement !== 'object') {
			throw new TypeError('invalid parameter "achievement". Expected an object.');
		}

		if (typeof achievement.name !== 'string') {
			throw new TypeError('invalid parameter "achievement.name". Expected a string.');
		}

		if (achievement.name.trim() === '') {
			throw new Error('invalid parameter "achievement.name". Expected a non-empty string.');
		}

		if (typeof achievement.id !== 'string') {
			throw new TypeError('invalid parameter "achievement.id". Expected a string.');
		}

		if (achievement.id.trim() === '') {
			throw new Error('invalid parameter "achievement.id". Expected a non-empty string.');
		}

		if (typeof achievement.goal !== 'number') {
			throw new TypeError('invalid parameter "achievement.goal". Expected a number.');
		}

		if (achievement.goal < 1) {
			throw new Error('invalid parameter "achievement.goal". Goal must be greater than 0.');
		}

		const achievements = this.getAchievements();
		if (achievements[achievement.id] == null) {
			achievements[achievement.id] = {
				name: achievement.name,
				goal: achievement.goal,
				progress: 0,
			};
		} else {
			achievements[achievement.id].name = achievement.name;
			achievements[achievement.id].goal = achievement.goal;
			const progress = achievements[achievement.id].progress;
			achievements[achievement.id].progress = Maths.clamp(progress, 0, achievement.goal);
		}

		localStorage[achievementSystemID] = JSON.stringify(achievements);
	}

	/**
	 * Меняет прогресс достижения.
	 *
	 * @param {string} id    Идентификатор достижения в системе.
	 * @param {number} value Значение, которое надо добавить (убрать) к прогрессу.
	 *
	 * @return {boolean} Возвращает true, если с изменением прогресса была достигнута цель.
	 */
	static changeProgress(id, value) {
		if (typeof id !== 'string') {
			throw new TypeError('invalid parameter "id". Expected a string.');
		}

		if (typeof value !== 'number') {
			throw new TypeError('invalid parameter "value". Expected a number.');
		}

		const achievements = this.getAchievements();
		const state = achievements[id];
		if (state == null) {
			throw new Error(`achievement with id "${id}" isn't defined.`);
		}

		if (state.progress === state.goal) {
			return false;
		}

		state.progress = Maths.clamp(state.progress + value, 0, state.goal);

		localStorage[achievementSystemID] = JSON.stringify(achievements);
		if (state.progress === state.goal) {
			console.log('цель достигнута');
			return true;
		} else {
			console.log(`текущее состояние ${state.progress}`);
			return false;
		}
	}

	/**
	 * Выполняет функцию для каждого достижения в системе, а потом сохраняет изменение.
	 *
	 * @param {function(id: string, state: {name: string, progress: number, goal: number}): void} action Выполняемая для достижения функция.
	 */
	static forEachAchievement(action) {
		if (typeof action !== 'function') {
			throw new TypeError('invalid parameter "action". Expected a function.');
		}

		const achievements = this.getAchievements();
		for (let id in achievements) {
			if (achievements.hasOwnProperty(id)) {
				action(id, achievements[id]);
			}
		}

		localStorage[achievementSystemID] = JSON.stringify(achievements);
	}

	/**
	 * @param {string} id Идентификатор достижения, которое надо получить.
	 *
	 * @returns {{name: string, progress: number, goal: number}} Возвращает достижение по передаваемому идентификатору.
	 */
	static getAchievement(id) {
		if (typeof id !== 'string') {
			throw new TypeError('invalid parameter "id". Expected a string.');
		}

		return this.getAchievements()[id];
	}
}
