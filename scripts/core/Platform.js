export default class Platform {
	static current = 0;

	static initialize() {
		const userAgent = window.navigator.userAgent;
		if (/Win/.test(userAgent)) {
			this.current = this.windows;
		} else if (/Android/.test(userAgent)) {
			this.current = this.android;
		} else if (/Linux/.test(userAgent)) {
			this.current = this.linux;
		} else if (/iPhone|iPad|iPod/.test(userAgent)) {
			this.current = this.ios;
		} else if (/Mac/.test(userAgent)) {
			this.current = this.mac;
		} else {
			this.current = this.unknown;
		}
	}

	static destroy() {
		this.current = -1;
	}

	static unknown = 0;
	static windows = 1;
	static linux = 2;
	static mac = 3;
	static android = 4;
	static ios = 5;
}