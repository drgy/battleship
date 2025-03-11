import { Grid } from "./Grid";
import { CellState, GridCell } from "./GridCell";
import { Ship } from "./Ship";

export class ShipSelection extends Phaser.GameObjects.Container {
	protected _ships: Ship[];
	protected _grid: Grid;
	protected _offset: { x: number; y: number };
	protected _columns = 2;
	protected _itemsPerColumn: number;
	protected _lastShip: Ship | null = null;

	public get lastShip(): Ship | null {
		return this._lastShip;
	}

	public resetShip(ship: Ship) {
		const index = this._ships.indexOf(ship);
		ship.setPosition(Math.floor(index / this._itemsPerColumn) * this._offset.x, (index % this._itemsPerColumn) * this._offset.y);
	}

	protected resetSelection() {
		this._lastShip = null;
		this._ships.forEach(ship => this.resetShip(ship));
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

		let currentTarget: GridCell | null = null;

		scene.input.on('dragstart', (pointer: any, ship: Ship) => {
			this._grid.removeShip(ship);
			ship.parentContainer.bringToTop(ship);
			this._lastShip = ship;
			ship.coords = { row: -1, column: -1 };
		});

		scene.input.on('drag', (pointer: any, ship: { x: any; y: any }, dragX: any, dragY: any) => {
			if (!currentTarget) {
				ship.x = dragX;
				ship.y = dragY;
			}
		});

		scene.input.on('dragenter', (pointer: any, ship: any, target: any) => {
			currentTarget = target.data.list.cell;

			this._grid.clearHelpers();
			this._grid.placeAttempt(ship, currentTarget!);

			const targetGlobalX = currentTarget!.parentContainer.x + target.x - target.displayWidth / 2;
			const targetGlobalY = currentTarget!.parentContainer.y + target.y - target.displayHeight / 2;

			const shipLocalX = targetGlobalX - ship.parentContainer.x;
			const shipLocalY = targetGlobalY - ship.parentContainer.y;

			ship.x = shipLocalX;
			ship.y = shipLocalY + (target.displayHeight * (ship.isVertical ? 0 : 1));
		});

		scene.input.on('dragleave', (pointer: any, ship: any, target: any) => {
			if (currentTarget === target.data.list.cell) {
				currentTarget = null;
				this._grid.clearHelpers();
			}
		});

		scene.input.on('drop', (pointer: any, ship: any, target: any) => {
			if (currentTarget?.cellState === CellState.READY) {
				this._grid.place(ship, target.data.list.cell);
				ship.coords = target.data.list.cell.coords;
			} else {
				this.resetShip(ship);
			}
		});

		scene.input.on('dragend', (pointer: any, ship: Ship, dropped: any) => {
			currentTarget = null;
			this._grid.clearHelpers();

			if (!dropped) {
				this.resetShip(ship);
			}
		});
	}
}