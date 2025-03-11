export enum CellState {
	UNKNOWN, WATER, SHIP, READY, BLOCKED
}

const COLORS = new Map<CellState, number>([
	[CellState.UNKNOWN, 0xeeeeff],
	[CellState.READY, 0x12aa12],
	[CellState.BLOCKED, 0xaa1212],
	[CellState.WATER, 0x1212aa],
	[CellState.SHIP, 0x1212aa]
]);
const BORDER_THICKNESS = 2;

export class GridCell extends Phaser.GameObjects.Graphics {
	protected _cellState: CellState;
	protected _size: number;
	protected _coords: { row: number; column: number };

	public get coords(): { row: number; column: number } {
		return this._coords;
	}

	public get cellState(): CellState {
		return this._cellState;
	}

	public set cellState(state: CellState) {
		this._cellState = state;
		this.draw();
	}

	constructor(scene: Phaser.Scene, x: number, y: number, size: number, initState: CellState, coords: { row: number; column: number }) {
		super(scene);
		this._coords = coords;
		this._cellState = initState;
		this._size = size;
		this.setPosition(x, y);
		this.draw();
		scene.add.existing(this);
		this.setInteractive();
	}

	public draw(): void {
		this.clear();

		this.fillStyle(COLORS.get(this._cellState)!, 0.5);
		this.fillRect(0, 0, this._size, this._size);

		this.lineStyle(BORDER_THICKNESS, COLORS.get(this._cellState)!, 0.8);
		this.strokeRect(0, 0, this._size, this._size);
	}
}