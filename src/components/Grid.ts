import { CellState, GridCell } from "./GridCell";
import { Ship } from "./Ship";

export class Grid extends Phaser.GameObjects.Container {
	protected _cells: GridCell[][] = [];
	private _cellSize: number;
	private _gridSize: number;
	private _originX: number = 0;
	private _originY: number = 0;

	public get serialized(): CellState[][] {
		return this._cells.map(row => row.map(cell => cell.cellState));
	}

	public get cellSize(): number {
		return this._cellSize;
	}

	constructor(scene: Phaser.Scene, cellCount: number, size: number, initState = CellState.UNKNOWN) {
		super(scene);

		this._gridSize = size;
		this._cellSize = size / cellCount;

		for (let row = 0; row < cellCount; row++) {
			this._cells[row] = [];
			for (let column = 0; column < cellCount; column++) {
				const x = column * this._cellSize;
				const y = row * this._cellSize;
				const cell = new GridCell(scene, x, y, this._cellSize, initState, { row, column });
				this._cells[row].push(cell);
				this.add(cell);
				cell.on('click', () => this.emit('cellClick', cell));
			}
		}

		this.setSize(size, size);

		scene.add.existing(this);
	}

	public getRandomCell(): GridCell {
		const row = Phaser.Math.Between(0, this._cells.length - 1);
		const column = Phaser.Math.Between(0, this._cells[row].length - 1);
		return this._cells[row][column];
	}

	public getAbsolutePosition(cell: GridCell): { x: number; y: number } {
		return {
			x: this.x + cell.x,
			y: this.y + cell.y
		};
	}

	public getCell(row: number, col: number): GridCell | null {
		if (row >= 0 && row < this._cells.length && col >= 0 && col < this._cells[row].length) {
			return this._cells[row][col];
		}

		return null;
	}

	// removes the ship from the grid cells
	public removeShip(ship: Ship) {
		const cell = this.getCell(ship.coords.row, ship.coords.column);

		if (cell) {
			for (let i = 0; i < ship.shipLength; i++) {
				this._cells[cell.coords.row + (ship.isVertical ? i : 0)][cell.coords.column + (ship.isVertical ? 0 : i)].cellState = CellState.WATER;
			}
		}
	}

	// resets the grid cells to the default state after placeAttempt
	public clearHelpers() {
		for (let row = 0; row < this._cells.length; row++) {
			for (let col = 0; col < this._cells[row].length; col++) {
				const cell = this._cells[row][col];
				if (cell.cellState === CellState.READY || cell.cellState === CellState.BLOCKED) {
					this._cells[row][col].cellState = CellState.WATER;
				}
			}
		}
	}

	// Checks if ship can be placed onto the grid cell, also highlights the grid cells appropriately
	public placeAttempt(ship: Ship, cell: GridCell): boolean {
		const row = cell.coords.row;
		const col = cell.coords.column;

		if (!ship.isVertical && ship.shipLength + col > this._cells[row].length) {
			for (let i = col; i < this._cells[row].length; i++) {
				const cell = this._cells[row][i];

				if (cell.cellState === CellState.WATER) {
					cell.cellState = CellState.BLOCKED;
				}
			}

			return false;
		}

		if (ship.isVertical && ship.shipLength + row > this._cells.length) {
			for (let i = row; i < this._cells.length; i++) {
				const cell = this._cells[i][col];

				if (cell.cellState === CellState.WATER) {
					cell.cellState = CellState.BLOCKED;
				}
			}

			return false;
		}

		for (let x = Math.max(0, row - 1); x < Math.min(this._cells.length, row + (ship.isVertical ? ship.shipLength + 1 : 2)); x++) {
			for (let y = Math.max(0, col - 1); y < Math.min(this._cells[x].length, col + (ship.isVertical ? 2 : ship.shipLength + 1)); y++) {
				if (this._cells[x][y].cellState !== CellState.WATER) {
					for (let i = 0; i < ship.shipLength; i++) {
						const cell = this._cells[row + (ship.isVertical ? i : 0)][col + (ship.isVertical ? 0 : i)];

						if (cell.cellState === CellState.WATER) {
							cell.cellState = CellState.BLOCKED;
						}
					}

					return false;
				}
			}
		}

		for (let i = 0; i < ship.shipLength; i++) {
			this._cells[row + (ship.isVertical ? i : 0)][col + (ship.isVertical ? 0 : i)].cellState = CellState.READY;
		}

		return true;
	}

	// Will place the ship onto the grid cell, first it should be checked if the ship can be placed
	public place(ship: Ship, cell: GridCell) {
		for (let i = 0; i < ship.shipLength; i++) {
			this._cells[cell.coords.row + (ship.isVertical ? i : 0)][cell.coords.column + (ship.isVertical ? 0 : i)].cellState = ship.isVertical ? CellState.SHIP_VERTICAL : CellState.SHIP_HORIZONTAL;
		}
	}

	// Adds dropzones to the grid cells, allowing for drag and drop functionality
	public addDropzones() {
		for (let row = 0; row < this._cells.length; row++) {
			for (let col = 0; col < this._cells[row].length; col++) {
				this.add(this.scene.add.zone(this._cells[row][col].x + (this._cellSize / 2), this._cells[row][col].y + (this._cellSize / 2), this._cellSize, this._cellSize).setRectangleDropZone(this._cellSize, this._cellSize).setData({ cell: this._cells[row][col] }));
			}
		}
	}

	public setOrigin(originX: number, originY: number): void {
		this._originX = originX;
		this._originY = originY;
		this.updatePosition();
	}

	private updatePosition(): void {
		const offsetX = this._gridSize * this._originX;
		const offsetY = this._gridSize * this._originY;

		this.setPosition(this.x - offsetX, this.y - offsetY);
	}

	public setCellsState(state: CellState): void {
		for (let row = 0; row < this._cells.length; row++) {
			for (let col = 0; col < this._cells[row].length; col++) {
				this._cells[row][col].cellState = state;
			}
		}
	}

	public setCellState(row: number, col: number, state: CellState): void {
		if (row >= 0 && row < this._cells.length && col >= 0 && col < this._cells[row].length) {
			this._cells[row][col].cellState = state;
		}
	}

	public set cellsState(state: CellState[][]) {
		for (let row = 0; row < this._cells.length; row++) {
			for (let col = 0; col < this._cells[row].length; col++) {
				this._cells[row][col].cellState = state[row][col];
			}
		}
	}
}