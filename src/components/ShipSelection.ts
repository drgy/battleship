import { Grid } from "./Grid";
import { CellState, GridCell } from "./GridCell";
import { Ship } from "./Ship";

type DragTarget = { target: { data: { list: { cell: GridCell } } } };

// Displays ships and handles their placement onto the grid
export class ShipSelection extends Phaser.GameObjects.Container {
	protected _ships: Ship[];
	protected _grid: Grid;
	protected _offset: { x: number; y: number };
	protected _columns = 2;
	protected _itemsPerColumn: number;
	protected _lastShip: Ship | null = null;

	public get allShipsPlaced(): boolean {
		return this._ships.every(ship => ship.coords.row >= 0);
	}

	public get lastShip(): Ship | null {
		return this._lastShip;
	}

	// Randomizes placement of all ships
	public randomPlacement() {
		this._grid.setCellsState(CellState.WATER);

		for (const ship of this._ships) {
			while (true) {
				const cell = this._grid.getRandomCell();

				if (cell) {
					// eslint-disable-next-line
					ship.isVertical = Phaser.Math.Between(0, 1) === 1;

					if (this._grid.placeAttempt(ship, cell)) {
						this._grid.place(ship, cell);
						ship.coords = cell.coords;
						ship.absolutePosition = this._grid.getAbsolutePosition(cell);
						break;
					}

					this._grid.clearHelpers();
				}
			}
		}
	}

	// Puts a single ship into the selection
	public resetShip(ship: Ship) {
		const index = this._ships.indexOf(ship);
		ship.coords = { row: -1, column: -1 };
		ship.setPosition(Math.floor(index / this._itemsPerColumn) * this._offset.x, (index % this._itemsPerColumn) * this._offset.y);
	}

	// Puts all ships into the selection
	public resetSelection() {
		this._lastShip = null;
		this._ships.forEach(ship => {
			ship.isVertical = false;
			this.resetShip(ship);
		});
	}

	constructor(scene: Phaser.Scene, ships: Ship[], grid: Grid) {
		super(scene);
		this._ships = ships;
		this._grid = grid;
		this._itemsPerColumn = Math.ceil(this._ships.length / this._columns);

		scene.add.existing(this);

		let maxShipLength = 0;

		for (const ship of ships) {
			this.add(ship);
			scene.input.setDraggable(ship);
			maxShipLength = Math.max(maxShipLength, ship.shipLength);
		}

		this._offset = { x: this._grid.cellSize * (maxShipLength + 1), y: this._grid.cellSize * 1.25 };
		this.setSize(this._columns * this._offset.x, this._itemsPerColumn * this._offset.y);
		this.resetSelection();

		// Drag & drop ships onto the grid
		let currentTarget: GridCell | null = null;

		scene.input.on('dragstart', (_p, ship: Ship) => {
			this._grid.removeShip(ship);
			ship.parentContainer.bringToTop(ship);
			this._lastShip = ship;
			ship.coords = { row: -1, column: -1 };
		});

		scene.input.on('drag', (_p, ship: Ship, dragX: number, dragY: number) => {
			if (!currentTarget) {
				ship.x = dragX;
				ship.y = dragY;
			}
		});

		scene.input.on('dragenter', (_p, ship: Ship, target: DragTarget) => {
			currentTarget = target.data.list.cell;

			this._grid.clearHelpers();

			if (currentTarget) {
				this._grid.placeAttempt(ship, currentTarget!);
				ship.absolutePosition = this._grid.getAbsolutePosition(currentTarget);
			}
		});

		scene.input.on('dragleave', (_p, ship: Ship, target: DragTarget) => {
			if (currentTarget === target.data.list.cell) {
				currentTarget = null;
				this._grid.clearHelpers();
			}
		});

		scene.input.on('drop', (_p, ship: Ship, target: DragTarget) => {
			if (currentTarget?.cellState === CellState.READY) {
				this._grid.place(ship, target.data.list.cell);
				ship.coords = target.data.list.cell.coords;
			} else {
				this.resetShip(ship);
			}
		});

		scene.input.on('dragend', (_p, ship: Ship, dropped: boolean) => {
			currentTarget = null;
			this._grid.clearHelpers();

			if (!dropped) {
				this.resetShip(ship);
			}
		});
	}
}