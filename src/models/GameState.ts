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

	constructor(pvp = true) {
		this.players.push(new Player());
		this.players.push(new Player(pvp ? PlayerType.HUMAN : PlayerType.COMPUTER));
	}
}