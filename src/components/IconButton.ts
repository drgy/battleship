import { Scene } from "phaser";

export class IconButton extends Phaser.GameObjects.Container {
	constructor(scene: Scene, texture: string, callback: () => void) {
		super(scene);

		const icon = scene.add.image(0, 0, texture);
		icon.setOrigin(0, 0);

		const background = scene.add.rectangle(icon.width / 2, icon.height / 2, icon.width * 1.25, icon.height * 1.25, 0xdddddd, 0.5);

		this.add(background);
		this.add(icon);

		this.setSize(background.width, background.height);
		this.setInteractive(new Phaser.Geom.Rectangle(this.width / 2, this.height / 2, this.width, this.height), Phaser.Geom.Rectangle.Contains);

		this.on('pointerover', () => scene.input.manager.canvas.style.cursor = 'pointer');
		this.on('pointerout', () => scene.input.manager.canvas.style.cursor = 'default');
		this.on('pointerup', callback);

		scene.add.existing(this);
	}
}