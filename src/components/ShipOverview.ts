import { Scene } from "phaser";
import { Ship } from "./Ship";

export class ShipOverview extends Phaser.GameObjects.Container {
	constructor(scene: Scene, ships: Ship[], unitSize: number) {
		super(scene);
		let maxShipLength = 0;

		for (const ship of ships) {
			this.add(ship);
			maxShipLength = Math.max(maxShipLength, ship.shipLength);
		}

		const columns = 2;
		const itemsPerColumn = Math.ceil(ships.length / columns);
		const offset = { x: unitSize * (maxShipLength + 1), y: unitSize * 1.25 };
		this.setSize(columns * offset.x, itemsPerColumn * offset.y);

		ships.forEach((ship, index) => {
			ship.setPosition(Math.floor(index / itemsPerColumn) * offset.x, (index % itemsPerColumn) * offset.y);
		});

		scene.add.existing(this);
	}
}