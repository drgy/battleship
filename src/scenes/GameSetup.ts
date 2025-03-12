import { Scene } from "phaser";
import { GameState } from "../models/GameState";
import { Grid } from "../components/Grid";
import { CellState } from "../components/GridCell";
import { ShipSelection } from "../components/ShipSelection";
import { IconButton } from "../components/IconButton";
import { Ship } from "../components/Ship";
import { PlayerType } from "../models/Player";

export class GameSetup extends Scene {
	protected _state: GameState;
	protected _grid: Grid;
	protected _ships: Ship[];
	protected _shipSelection: ShipSelection;

	constructor() {
		super('GameSetup');
	}

	init(data: { state: GameState }) {
		this._state = data.state;
	}

	create() {
		const center = {
			x: this.scale.width / 2,
			y: this.scale.height / 2
		};
		this.add.image(center.x, center.y, 'background');

		this._grid = new Grid(this, this._state.gridSize, Math.min((this.scale.width / 2) - 100, this.scale.height - 100), CellState.WATER);
		this._grid.setPosition(this.scale.width / 4, this.scale.height / 2);
		this._grid.setOrigin(0.5, 0.5);
		this.add.existing(this._grid);
		this._grid.addDropzones();

		const menuButton = new IconButton(this, 'back', () => this.scene.start('MainMenu'));
		menuButton.setPosition(10, 10);

		this._ships = this._state.shipFactory(this, this._grid.cellSize);
		this._shipSelection = new ShipSelection(this, this._ships, this._grid);

		const rightColumnX = (this.scale.width * 0.75) - (this._shipSelection.displayWidth / 2);
		this._shipSelection.setPosition(rightColumnX, (this.scale.height / 2) - (this._shipSelection.displayHeight / 2));

		const gameStateText = this.add.text(this.scale.width - 100, 50, `${this._state.player1.name} place ships`, {
			fontFamily: 'Arial Black', fontSize: 42, color: '#ffffff',
			stroke: '#000000', strokeThickness: 8,
			align: 'right'
		}).setOrigin(1, 0);

		const buttonContainer = this.add.container();

		const rotateButton = new IconButton(this, 'rotate', () => {
			const ship = this._shipSelection.lastShip;

			if (ship) {
				const cell = this._grid.getCell(ship.coords.row, ship.coords.column);

				if (cell) {
					this._grid.removeShip(ship);

					ship.isVertical = !ship.isVertical;

					if (this._grid.placeAttempt(ship, cell)) {
						this._grid.place(ship, cell);
					} else {
						this._grid.clearHelpers();
						ship.coords = { row: -1, column: -1 };
						this._shipSelection.resetShip(ship);
					}
				} else {
					ship.isVertical = !ship.isVertical;
				}
			}
		});
		buttonContainer.add(rotateButton);

		const continueButton = new IconButton(this, 'play', () => {
			if (this._shipSelection.allShipsPlaced) {
				if (!this._state.player1.playerGrid) {
					this._state.player1.playerGrid = this._grid.serialized;
					this._shipSelection.resetSelection();
					this._grid.setCellsState(CellState.UNKNOWN);
					this._state.player1.enemyGrid = this._grid.serialized;
					this._grid.setCellsState(CellState.WATER);

					if (this._state.player2.type === PlayerType.HUMAN) {
						gameStateText.setText(`${this._state.player2.name} place ships`);

						return;
					}

					this._shipSelection.randomPlacement();
				}

				this._state.player2.playerGrid = this._grid.serialized;
				this._grid.setCellsState(CellState.UNKNOWN);
				this._state.player2.enemyGrid = this._grid.serialized;
				this.scene.start('Game', { state: this._state });
			}
		});
		continueButton.x = 150;
		buttonContainer.add(continueButton);

		const shuffleButton = new IconButton(this, 'random', () => this._shipSelection.randomPlacement());
		shuffleButton.x = 300;
		buttonContainer.add(shuffleButton);

		buttonContainer.setPosition(rightColumnX, (this.scale.height / 2) + (this._shipSelection.displayHeight / 2));
	}
}