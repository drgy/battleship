import { Scene } from 'phaser';

export class Boot extends Scene {
	constructor() {
		super('Boot');
	}

	preload() {
		this.load.image('background', `${import.meta.env.BASE_URL}water_bg.png`);
	}

	create() {
		this.scene.start('Preloader');
	}
}
