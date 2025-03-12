import { Scene } from 'phaser';
import { GameState } from '../models/GameState';
import { CellState, GridCell } from '../components/GridCell';
import { Grid } from '../components/Grid';
import { ShipOverview } from '../components/ShipOverview';
import { Player } from '../models/Player';
import { IconButton } from '../components/IconButton';

export class Game extends Scene {
	protected state: GameState;
	protected grid: Grid;
	protected gameStateText: Phaser.GameObjects.Text;
	protected ready = false;
	protected currentPlayer: Player;
	protected timeDelay = 1000;

	constructor() {
		super('Game');
	}

	init(data: { state: GameState }) {
		this.state = data.state;
	}

	protected startTurn(player: Player) {
		this.gameStateText.setText(`${player.name} plays`);
		player.shipOverview.setVisible(true);
		this.grid.cellsState = player.enemyGrid;
		this.currentPlayer = player;
		this.ready = true;
	}

	protected attack(cell: GridCell) {
		if (cell.cellState === CellState.UNKNOWN && this.ready) {
			this.ready = false;
			const enemyPlayer = this.currentPlayer === this.state.player1 ? this.state.player2 : this.state.player1;
			const targetCellState = enemyPlayer.playerGrid[cell.coords.row][cell.coords.column];

			if (targetCellState !== CellState.WATER) {
				let row = cell.coords.row;
				let col = cell.coords.column;

				this.currentPlayer.enemyGrid[row][col] = CellState.HIT;
				cell.cellState = CellState.HIT;
				let length = 0;
				let sunk = false;

				const enemyHasShip = (row: number, col: number) => enemyPlayer.playerGrid[row][col] === CellState.SHIP_HORIZONTAL || enemyPlayer.playerGrid[row][col] === CellState.SHIP_VERTICAL;
				const hasHit = (row: number, col: number) => this.currentPlayer.enemyGrid[row][col] === CellState.HIT;

				const fillRow = (from: number, to: number, row: number) => {
					if (row < 0 || row >= this.currentPlayer.enemyGrid.length) {
						return;
					}

					for (let i = Math.max(0, from); i < Math.min(to, this.currentPlayer.enemyGrid[row].length); i++) {
						this.currentPlayer.enemyGrid[row][i] = CellState.WATER;
					}
				}

				const fillCol = (from: number, to: number, col: number) => {
					if (col < 0 || col >= this.currentPlayer.enemyGrid.length) {
						return;
					}

					for (let i = Math.max(0, from); i < Math.min(to, this.currentPlayer.enemyGrid.length); i++) {
						this.currentPlayer.enemyGrid[i][col] = CellState.WATER;
					}
				}

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
										this.currentPlayer.enemyGrid[row][start - 1] = CellState.WATER;
									}

									if (end + 1 < this.currentPlayer.enemyGrid[row].length) {
										this.currentPlayer.enemyGrid[row][end + 1] = CellState.WATER;
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
										this.currentPlayer.enemyGrid[start - 1][col] = CellState.WATER;
									}

									if (end + 1 < this.currentPlayer.enemyGrid.length) {
										this.currentPlayer.enemyGrid[end + 1][col] = CellState.WATER;
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

				if (sunk) {
					this.grid.cellsState = this.currentPlayer.enemyGrid;
					const idx = this.currentPlayer.ships.findIndex(ship => ship.shipLength === length);

					if (idx >= 0) {
						this.currentPlayer.ships[idx].destroy();
						this.currentPlayer.ships.splice(idx, 1);

						if (!this.currentPlayer.shipOverview.length) {
							this.scene.start('GameOver', { state: this.state });
						}
					}
				}

				this.ready = true;

			} else {
				this.currentPlayer.enemyGrid[cell.coords.row][cell.coords.column] = CellState.WATER;
				cell.cellState = CellState.WATER;
				this.gameStateText.setText(`${this.currentPlayer.name} missed`);

				setTimeout(() => {
					this.currentPlayer.shipOverview.setVisible(false);
					this.startTurn(enemyPlayer);
				}, this.timeDelay);
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

		this.grid = new Grid(this, this.state.gridSize, Math.min((this.scale.width / 2) - 100, this.scale.height - 100), CellState.UNKNOWN, this.attack);
		this.grid.setPosition(this.scale.width / 4, this.scale.height / 2);
		this.grid.setOrigin(0.5, 0.5);
		this.add.existing(this.grid);

		this.state.player1.ships = this.state.shipFactory(this, this.grid.cellSize, false);
		this.state.player1.shipOverview = new ShipOverview(this, this.state.player1.ships, this.grid.cellSize);

		this.state.player2.ships = this.state.shipFactory(this, this.grid.cellSize, false);
		this.state.player2.shipOverview = new ShipOverview(this, this.state.player2.ships, this.grid.cellSize);

		const overviewPosition = { x: (this.scale.width * 0.75) - (this.state.player1.shipOverview.displayWidth / 2), y: (this.scale.height / 2) - (this.state.player1.shipOverview.displayHeight / 2) };
		this.state.player1.shipOverview.setPosition(overviewPosition.x, overviewPosition.y);
		this.state.player1.shipOverview.setVisible(false);
		this.state.player2.shipOverview.setPosition(overviewPosition.x, overviewPosition.y);
		this.state.player2.shipOverview.setVisible(false);

		this.gameStateText = this.add.text(this.scale.width - 100, 50, `${this.state.player1.name} plays`, {
			fontFamily: 'Arial Black', fontSize: 42, color: '#ffffff',
			stroke: '#000000', strokeThickness: 8,
			align: 'right'
		}).setOrigin(1, 0);

		this.grid.on('cellClick', cell => this.attack(cell));

		this.startTurn(this.state.player1);
	}
}
