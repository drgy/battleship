import { Ship } from "../components/Ship";

export enum PlayerType {
	HUMAN, COMPUTER
}

export class Player {
	public type: PlayerType;
	protected ships: Ship[] = [];
	
	constructor(type = PlayerType.HUMAN) {
		this.type = type;
	}
}