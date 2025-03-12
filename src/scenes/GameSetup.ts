import { Scene } from "phaser";
import { GameState } from "../models/GameState";
import { Grid } from "../components/Grid";
import { CellState } from "../components/GridCell";
import { ShipSelection } from "../components/ShipSelection";
import { IconButton } from "../components/IconButton";
import { Ship } from "../components/Ship";
import { PlayerType } from "../models/Player";

export class GameSetup extends Scene {
	protected state: GameState;
	protected grid: Grid;
	protected ships: Ship[];
	protected shipSelection: ShipSelection;

	constructor() {
		super('GameSetup');
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

		this.grid = new Grid(this, this.state.gridSize, Math.min((this.scale.width / 2) - 100, this.scale.height - 100), CellState.WATER);
		this.grid.setPosition(this.scale.width / 4, this.scale.height / 2);
		this.grid.setOrigin(0.5, 0.5);
		this.add.existing(this.grid);
		this.grid.addDropzones();

		this.ships = this.state.shipFactory(this, this.grid.cellSize);
		this.shipSelection = new ShipSelection(this, this.ships, this.grid);

		const rightColumnX = (this.scale.width * 0.75) - (this.shipSelection.displayWidth / 2);
		this.shipSelection.setPosition(rightColumnX, (this.scale.height / 2) - (this.shipSelection.displayHeight / 2));

		const gameStateText = this.add.text(this.scale.width - 100, 50, `${this.state.player1.name} place ships`, {
			fontFamily: 'Arial Black', fontSize: 42, color: '#ffffff',
			stroke: '#000000', strokeThickness: 8,
			align: 'right'
		}).setOrigin(1, 0);

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

		const continueButton = new IconButton(this, 'play', () => {
			if (this.shipSelection.allShipsPlaced) {
				if (!this.state.player1.playerGrid) {
					this.state.player1.playerGrid = this.grid.serialized;
					this.shipSelection.resetSelection();
					this.grid.setCellsState(CellState.UNKNOWN);
					this.state.player1.enemyGrid = this.grid.serialized;
					this.grid.setCellsState(CellState.WATER);

					if (this.state.player2.type === PlayerType.HUMAN) {
						gameStateText.setText(`${this.state.player2.name} place ships`);

						return;
					}

					this.shipSelection.randomPlacement();
				}

				this.state.player2.playerGrid = this.grid.serialized;
				this.grid.setCellsState(CellState.UNKNOWN);
				this.state.player2.enemyGrid = this.grid.serialized;
				this.scene.start('Game', { state: this.state });
			}
		});
		continueButton.x = 150;
		buttonContainer.add(continueButton);

		const shuffleButton = new IconButton(this, 'random', () => this.shipSelection.randomPlacement());
		shuffleButton.x = 300;
		buttonContainer.add(shuffleButton);

		buttonContainer.setPosition(rightColumnX, (this.scale.height / 2) + (this.shipSelection.displayHeight / 2));
	}
}