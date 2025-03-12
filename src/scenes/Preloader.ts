import { Scene } from 'phaser';

export class Preloader extends Scene  {
	constructor() {
		super('Preloader');
	}

	init() {
		const center = {
			x: this.scale.width / 2,
			y: this.scale.height / 2
		};
		const loadWidth = 600;
		const loadHeight = 64;

		this.add.image(center.x, center.y, 'background');

		this.add.rectangle(center.x, center.y, loadWidth, loadHeight).setStrokeStyle(1, 0xffffff);
		const bar = this.add.rectangle(center.x - (loadWidth / 2) + 2, center.y, 4, 64, 0xffffff);

		this.load.on('progress', (progress: number) => {
			bar.width = loadWidth * progress;
		});
	}

	preload() {
		this.load.setPath(import.meta.env.BASE_URL);

		['logo', 'ship1', 'ship2', 'ship3', 'ship4', 'rotate', 'play', 'random' ].forEach(pngAsset => this.load.image(pngAsset, `${pngAsset}.png`));
	}

	create() {
		this.scene.start('MainMenu');
	}
}
