import { Scene } from 'phaser';
import { GameState } from '../models/GameState';
import { CellState, GridCell } from '../components/GridCell';
import { Grid } from '../components/Grid';
import { ShipOverview } from '../components/ShipOverview';
import { Player, PlayerType } from '../models/Player';
import { IconButton } from '../components/IconButton';

export class Game extends Scene {
	protected _state: GameState;
	protected _grid: Grid;
	protected _gameStateText: Phaser.GameObjects.Text;
	protected _ready = false;
	protected _currentPlayer: Player;
	protected _timeDelay = 1000;

	constructor() {
		super('Game');
	}

	init(data: { state: GameState }) {
		this._state = data.state;
	}

	// Simple AI picking random cells
	protected aiTurn() {
		setTimeout(() => {
			let target;

			// try to get random cell
			for (let i = 0; i < 50; i++) {
				target = this._grid.getRandomCell();

				if (target.cellState === CellState.UNKNOWN) {
					break;
				}
			}


			// In case there are too few cells, the probability of finding one by random is low
			if (target!.cellState !== CellState.UNKNOWN) {
				for (let row = 0; row < this._currentPlayer.enemyGrid.length; row++) {
					for (let col = 0; col < this._currentPlayer.enemyGrid[row].length; col++) {
						target = this._grid.getCell(row, col);

						if (target!.cellState === CellState.UNKNOWN) {
							break;
						}
					}
				}
			}

			this.attack(target!, true);

			if (target!.cellState === CellState.HIT) {
				this.aiTurn();
			}
		}, this._timeDelay);
	}

	protected startTurn(player: Player) {
		this._gameStateText.setText(`${player.name} plays`);
		player.shipOverview.setVisible(true);
		this._grid.cellsState = player.enemyGrid;
		this._currentPlayer = player;

		if (this._currentPlayer.type === PlayerType.HUMAN) {
			this._ready = true;
		} else {
			this.aiTurn();
		}
	}

	// Resolves player's move
	protected attack(cell: GridCell, force = false) {
		if (cell.cellState === CellState.UNKNOWN && (this._ready || force)) {
			this._ready = false;
			const enemyPlayer = this._currentPlayer === this._state.player1 ? this._state.player2 : this._state.player1;
			const targetCellState = enemyPlayer.playerGrid[cell.coords.row][cell.coords.column];

			if (targetCellState !== CellState.WATER) {
				const row = cell.coords.row;
				const col = cell.coords.column;

				this._currentPlayer.enemyGrid[row][col] = CellState.HIT;
				cell.cellState = CellState.HIT;
				let length = 0;
				let sunk = false;

				const enemyHasShip = (row: number, col: number) => enemyPlayer.playerGrid[row][col] === CellState.SHIP_HORIZONTAL || enemyPlayer.playerGrid[row][col] === CellState.SHIP_VERTICAL;
				const hasHit = (row: number, col: number) => this._currentPlayer.enemyGrid[row][col] === CellState.HIT;

				const fillRow = (from: number, to: number, row: number) => {
					if (row < 0 || row >= this._currentPlayer.enemyGrid.length) {
						return;
					}

					for (let i = Math.max(0, from); i < Math.min(to, this._currentPlayer.enemyGrid[row].length); i++) {
						this._currentPlayer.enemyGrid[row][i] = CellState.WATER;
					}
				};

				const fillCol = (from: number, to: number, col: number) => {
					if (col < 0 || col >= this._currentPlayer.enemyGrid.length) {
						return;
					}

					for (let i = Math.max(0, from); i < Math.min(to, this._currentPlayer.enemyGrid.length); i++) {
						this._currentPlayer.enemyGrid[i][col] = CellState.WATER;
					}
				};

				// Check for ship sink
				if (targetCellState === CellState.SHIP_HORIZONTAL) {
					let start = col;
					let end = col;

					// Find ship end
					while (true) {

						// Exit early if player didn't sink the whole ship
						if (end + 1 < enemyPlayer.playerGrid[row].length && enemyHasShip(row, end + 1) && !hasHit(row, end + 1)) {
							break;
						} 
						
						// Ship was hit until the end
						if (end + 1 >= enemyPlayer.playerGrid[row].length || !enemyHasShip(row, end + 1)) {

							// Find the ship start
							while (true) {

								// Exit early if player didn't sink the whole ship
								if (start > 0 && enemyHasShip(row, start - 1) && !hasHit(row, start - 1)) {
									break;
								}

								// Ship was hit from start to end => ship was sunk
								if (start <= 0 || !enemyHasShip(row, start - 1)) {
									sunk = true;
									length = end - start + 1;

									// Area around the sunk fish is water
									fillRow(start - 1, end + 2, row + 1);
									fillRow(start - 1, end + 2, row - 1);

									if (start > 0) {
										this._currentPlayer.enemyGrid[row][start - 1] = CellState.WATER;
									}

									if (end + 1 < this._currentPlayer.enemyGrid[row].length) {
										this._currentPlayer.enemyGrid[row][end + 1] = CellState.WATER;
									}

									break;
								}

								start--;
							}

							break;
						}

						end++;
					}
				} else {
					// Vertical orientation
					let start = row;
					let end = row;

					// Find ship end
					while (true) {

						// Exit early if player didn't sink the whole ship
						if (end + 1 < enemyPlayer.playerGrid.length && enemyHasShip(end + 1, col) && !hasHit(end + 1, col)) {
							break;
						}

						// Ship was hit until the end
						if (end + 1 >= enemyPlayer.playerGrid.length || !enemyHasShip(end + 1, col)) {

							// Find the ship start
							while (true) {

								// Exit early if player didn't sink the whole ship
								if (start > 0 && enemyHasShip(start - 1, col) && !hasHit(start - 1, col)) {
									break;
								}

								// Ship was hit from start to end => ship was sunk
								if (start <= 0 || !enemyHasShip(start - 1, col)) {
									sunk = true;
									length = end - start + 1;

									// Area around the sunk fish is water
									fillCol(start - 1, end + 2, col + 1);
									fillCol(start - 1, end + 2, col - 1);

									if (start > 0) {
										this._currentPlayer.enemyGrid[start - 1][col] = CellState.WATER;
									}

									if (end + 1 < this._currentPlayer.enemyGrid.length) {
										this._currentPlayer.enemyGrid[end + 1][col] = CellState.WATER;
									}

									break;
								}

								start--;
							}

							break;
						}

						end++;
					}
				}

				// Ship was sunk, player stays in turn
				if (sunk) {
					this._grid.cellsState = this._currentPlayer.enemyGrid;
					const idx = this._currentPlayer.ships.findIndex(ship => ship.shipLength === length);

					if (idx >= 0) {
						this._currentPlayer.ships[idx].destroy();
						this._currentPlayer.ships.splice(idx, 1);

						// If all the ships are sunk player wins
						if (!this._currentPlayer.shipOverview.length) {
							this.scene.start('GameOver', { state: this._state });
						}
					}
				}

				this._ready = true;

			} else {
				// On miss switch the players after a small delay
				this._currentPlayer.enemyGrid[cell.coords.row][cell.coords.column] = CellState.WATER;
				cell.cellState = CellState.WATER;
				this._gameStateText.setText(`${this._currentPlayer.name} missed`);

				setTimeout(() => {
					this._currentPlayer.shipOverview.setVisible(false);
					this.startTurn(enemyPlayer);
				}, this._timeDelay);
			}
		}
	}

	create() {
		const center = {
			x: this.scale.width / 2,
			y: this.scale.height / 2
		};
		this.add.image(center.x, center.y, 'background');

		const menuButton = new IconButton(this, 'back', () => this.scene.start('MainMenu'));
		menuButton.setPosition(10, 10);

		this._grid = new Grid(this, this._state.gridSize, Math.min((this.scale.width / 2) - 100, this.scale.height - 100), CellState.UNKNOWN, this.attack);
		this._grid.setPosition(this.scale.width / 4, this.scale.height / 2);
		this._grid.setOrigin(0.5, 0.5);
		this.add.existing(this._grid);

		this._state.player1.ships = this._state.shipFactory(this, this._grid.cellSize, false);
		this._state.player1.shipOverview = new ShipOverview(this, this._state.player1.ships, this._grid.cellSize);

		this._state.player2.ships = this._state.shipFactory(this, this._grid.cellSize, false);
		this._state.player2.shipOverview = new ShipOverview(this, this._state.player2.ships, this._grid.cellSize);

		const overviewPosition = { x: (this.scale.width * 0.75) - (this._state.player1.shipOverview.displayWidth / 2), y: (this.scale.height / 2) - (this._state.player1.shipOverview.displayHeight / 2) };
		this._state.player1.shipOverview.setPosition(overviewPosition.x, overviewPosition.y);
		this._state.player1.shipOverview.setVisible(false);
		this._state.player2.shipOverview.setPosition(overviewPosition.x, overviewPosition.y);
		this._state.player2.shipOverview.setVisible(false);

		this._gameStateText = this.add.text(this.scale.width - 100, 50, `${this._state.player1.name} plays`, {
			fontFamily: 'Arial Black', fontSize: 42, color: '#ffffff',
			stroke: '#000000', strokeThickness: 8,
			align: 'right'
		}).setOrigin(1, 0);

		this._grid.on('cellClick', cell => this.attack(cell));

		this.startTurn(this._state.player1);
	}
}
