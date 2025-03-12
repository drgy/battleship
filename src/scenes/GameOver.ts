import { Scene } from 'phaser';
import { GameState } from '../models/GameState';

export class GameOver extends Scene {
	protected state: GameState;

	constructor() {
		super('GameOver');
	}

	init(data: { state: GameState }) {
		this.state = data.state;
	}

	create() {
		const center = {
			x: this.scale.width / 2,
			y: this.scale.height / 2
		};
		this.add.image(center.x, center.y, 'background');

		this.add.text(center.x, center.y, `${this.state.player1.ships.length ? this.state.player2.name : this.state.player1.name} won`, {
			fontFamily: 'Arial Black', fontSize: 42, color: '#ffffff',
			stroke: '#000000', strokeThickness: 8,
			align: 'center'
		}).setOrigin(0.5, 0.5);
	}
}
