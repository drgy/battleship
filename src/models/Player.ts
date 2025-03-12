import { CellState } from "../components/GridCell";
import { Ship } from "../components/Ship";
import { ShipOverview } from "../components/ShipOverview";

export enum PlayerType {
	HUMAN, COMPUTER
}

export class Player {
	public type: PlayerType;
	public name: string;
	public playerGrid: CellState[][];
	public enemyGrid: CellState[][];
	public ships: Ship[];
	public shipOverview: ShipOverview;
	
	constructor(name: string, type = PlayerType.HUMAN) {
		this.type = type;
		this.name = name;
	}
}