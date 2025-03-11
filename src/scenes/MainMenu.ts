import { Scene } from 'phaser';
import { GameState } from '../models/GameState';

export class MainMenu extends Scene {
	constructor() {
		super('MainMenu');
	}

	create() {
		const center = {
			x: this.scale.width / 2,
			y: this.scale.height / 2
		};

		this.add.image(center.x, center.y, 'background');
		this.add.image(center.x, 128, 'logo');

		this.add.text(center.x, 280, 'Main Menu', {
			fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
			stroke: '#000000', strokeThickness: 8,
			align: 'center'
		}).setOrigin(0.5);

		const pvpText = this.add.text(center.x, 400, 'Player vs Player', {
			fontFamily: 'Arial Black', fontSize: 42, color: '#ffffff',
			stroke: '#000000', strokeThickness: 8,
			align: 'center'
		}).setOrigin(0.5).setInteractive();

		pvpText.on('pointerdown', () => this.scene.start('GameSetup', { state: new GameState() }));
		pvpText.on('pointerover', () => {
			this.input.manager.canvas.style.cursor = 'pointer';
			this.tweens.add({
				targets: pvpText,
				scale: 1.1,
				duration: 100,
				ease: 'Power2'
			});
		});
		pvpText.on('pointerout', () => {
			this.input.manager.canvas.style.cursor = 'default';
			this.tweens.add({
				targets: pvpText,
				scale: 1,
				duration: 100,
				ease: 'Power2'
			});
		});

		const pvcText = this.add.text(center.x, 480, 'Player vs Computer', {
			fontFamily: 'Arial Black', fontSize: 42, color: '#ffffff',
			stroke: '#000000', strokeThickness: 8,
			align: 'center'
		}).setOrigin(0.5).setInteractive();

		pvcText.on('pointerdown', () => this.scene.start('GameSetup', { state: new GameState(false) }));
		pvcText.on('pointerover', () => {
			this.input.manager.canvas.style.cursor = 'pointer';
			this.tweens.add({
				targets: pvcText,
				scale: 1.1,
				duration: 100,
				ease: 'Power2'
			});
		});
		pvcText.on('pointerout', () => {
			this.input.manager.canvas.style.cursor = 'default';
			this.tweens.add({
				targets: pvcText,
				scale: 1,
				duration: 100,
				ease: 'Power2'
			});
		});
	}
}
