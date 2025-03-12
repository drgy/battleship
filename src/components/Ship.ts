export class Ship extends Phaser.GameObjects.Container {
	protected _shipLength: number;
	protected _sprite: Phaser.GameObjects.Sprite;
	protected _isVertical: boolean = false;
	protected _unitSize: number;

	public coords: { row: number; column: number } = { row: -1, column: -1 };

	public set isVertical(isVertical: boolean) {
		this._isVertical = isVertical;
		this.setRotation(this._isVertical ? Math.PI : Math.PI / 2);

		if (this.coords.row >= 0) {
			this.y += this._unitSize * (this._isVertical ? -1 : 1);
		}
	}

	public get isVertical(): boolean {
		return this._isVertical;
	}

	public get shipLength(): number {
		return this._shipLength;
	}

	// eslint-disable-next-line
	public set absolutePosition(position: { x: number; y: number }) {
		this.setPosition(position.x - this.parentContainer.x, position.y - this.parentContainer.y + (this._unitSize * (this._isVertical ? 0 : 1)));
	}

	constructor(scene: Phaser.Scene, length: number, unitSize: number, draggable = true) {
		super(scene);
		this._shipLength = length;
		this._unitSize = unitSize;
		this._sprite = scene.add.sprite(0, 0, `ship${length}`);
		this._sprite.setScale((unitSize * length) / this._sprite.height);
		this._sprite.setOrigin(1, 1);
		this._sprite.x = (this._sprite.width - this._unitSize) / 2;
		this.setSize(this._unitSize, this._unitSize * this._shipLength);
		this.isVertical = false;

		if (draggable) {
			this.setInteractive(new Phaser.Geom.Rectangle(-this.width / 2, -this.height / 2, this.width, this.height), Phaser.Geom.Rectangle.Contains);
			
			this.on('pointerover', () => scene.input.manager.canvas.style.cursor = 'pointer');
			this.on('pointerout', () => scene.input.manager.canvas.style.cursor = 'default');
		}

		this.add(this._sprite);
		scene.add.existing(this);
	}
}