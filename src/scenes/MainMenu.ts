import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene {
	background: GameObjects.Image;
	logo: GameObjects.Image;
	title: GameObjects.Text;

	constructor() {
		super('MainMenu');
	}

	create() {
		const center = {
			x: this.scale.width / 2,
			y: this.scale.height / 2
		};

		this.background = this.add.image(center.x, center.y, 'background');
		this.logo = this.add.image(center.x, 128, 'logo');

		this.title = this.add.text(center.x, 256, 'Main Menu', {
			fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
			stroke: '#000000', strokeThickness: 8,
			align: 'center'
		}).setOrigin(0.5);

		this.input.once('pointerdown', () => {

			this.scene.start('Game');

		});
	}
}
