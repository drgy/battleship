import { Scene } from "phaser";
import { GameState } from "../models/GameState";
import { Grid } from "../components/Grid";
import { Player, PlayerType } from "../models/Player";
import { CellState, GridCell } from "../components/GridCell";
import { Ship } from "../components/Ship";
import { ShipSelection } from "../components/ShipSelection";
import { IconButton } from "../components/IconButton";

export class GameSetup extends Scene {
	protected state: GameState;
	protected grid: Grid;
	protected shipSelection: ShipSelection;

	constructor() {
		super('GameSetup');
	}

	init(data: { state: GameState }) {
		this.state = data.state;
	}

	protected placeShips(player: Player) {
		if (player.type === PlayerType.HUMAN) {
			
		}
	}

	create() {
		const center = {
			x: this.scale.width / 2,
			y: this.scale.height / 2
		};
		this.add.image(center.x, center.y, 'background');

		this.grid = new Grid(this, this.state.gridSize, Math.min((this.scale.width / 2) - 100, this.scale.height - 100), CellState.WATER, true);
		this.grid.setPosition(this.scale.width / 4, this.scale.height / 2);
		this.grid.setOrigin(0.5, 0.5);
		this.add.existing(this.grid);
		this.grid.addDropzones();

		const ships: Ship[] = [];

		this.state.ships.forEach((count, length) => {
			for (let i = 0; i < count; i++) {
				const ship = new Ship(this, length, this.grid.cellSize);
				ships.push(ship);
			}
		});

		this.shipSelection = new ShipSelection(this, ships, this.grid);

		const rightColumnX = (this.scale.width * 0.75) - (this.shipSelection.displayWidth / 2);
		this.shipSelection.setPosition(rightColumnX, (this.scale.height / 2) - (this.shipSelection.displayHeight / 2));

		const buttonContainer = this.add.container();

		const rotateButton = new IconButton(this, 'rotate', () => {
			const ship = this.shipSelection.lastShip;

			if (ship) {
				const cell = this.grid.getCell(ship.coords.row, ship.coords.column);

				if (cell) {
					this.grid.removeShip(ship);

					ship.isVertical = !ship.isVertical;

					if (this.grid.placeAttempt(ship, cell)) {
						this.grid.place(ship, cell);
					} else {
						this.grid.clearHelpers();
						ship.coords = { row: -1, column: -1 };
						this.shipSelection.resetShip(ship);
					}
				} else {
					ship.isVertical = !ship.isVertical;
				}
			}
		});
		buttonContainer.add(rotateButton);

		buttonContainer.setPosition(rightColumnX, (this.scale.height / 2) + (this.shipSelection.displayHeight / 2));
		
		this.placeShips(this.state.player1);
	}
}