export default class StateMap {
	width: number;
	height: number;
	data: Array<Array<any>>;
	constructor(width: number, height: number, data: any = null) {
		this.width = width;
		this.height = height;
		this.data = Array(height)
			.fill(null)
			.map(() => Array(width).fill(data));
	}
	forRect(
		x: number,
		y: number,
		width: number,
		height: number,
		fn: (data: any, x: number, y: number) => void
	) {
		for (let yi = y; yi < y + height; yi++)
			for (let xi = x; xi < x + width; xi++) fn(this.safeGet(xi, yi), xi, yi);
	}
	fillRect(x: number, y: number, width: number, height: number, data: any) {
		this.forRect(x, y, width, height, (_, x, y) => this.safeSet(x, y, data));
	}
	forAll(fn: (data: any, x: number, y: number) => void) {
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				fn(this.data[y][x], x, y);
			}
		}
	}
	get(x: number, y: number) {
		return this.data[y][x];
	}
	set(x: number, y: number, data: any) {
		this.data[y][x] = data;
	}
	safe(x: number, y: number) {
		return y >= 0 && y < this.height && x >= 0 && x < this.width;
	}
	safeGet(x: number, y: number) {
		if (this.safe(x, y)) return this.data[y][x];
	}
	safeSet(x: number, y: number, data: any) {
		if (this.safe(x, y)) this.data[y][x] = data;
	}
	testRect(
		x: number,
		y: number,
		width: number,
		height: number,
		map: Array<Array<any>>,
		onUndefined = undefined
	) {
		for (let yi = y; yi < y + height; yi++)
			for (let xi = x; xi < x + width; xi++) {
				let data = this.safeGet(xi, yi);
				if (data === undefined) data = onUndefined;
				const mapData = map[xi - x][yi - y];
				if (mapData !== data) return false;
			}
		return true;
	}
}
