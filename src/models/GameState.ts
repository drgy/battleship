import { Scene } from "phaser";
import { Ship } from "../components/Ship";
import { Player, PlayerType } from "./Player";

export class GameState {
	public readonly gridSize = 10;
	public readonly ships: number[] = [0, 4, 3, 2, 1];
	protected players: Player[] = [];

	public get player1(): Player {
		return this.players[0];
	}

	public get player2(): Player {
		return this.players[1];
	}

	public shipFactory(scene: Scene, unitSize: number, draggable = true): Ship[] {
		const ships: Ship[] = [];
		
		this.ships.forEach((count, length) => {
			for (let i = 0; i < count; i++) {
				const ship = new Ship(scene, length, unitSize, draggable);
				ships.push(ship);
			}
		});

		return ships;
	}

	constructor(pvp = true) {
		this.players.push(new Player('Player 1'));
		this.players.push(new Player(pvp ? 'Player 2' : 'Computer', pvp ? PlayerType.HUMAN : PlayerType.COMPUTER));
	}
}