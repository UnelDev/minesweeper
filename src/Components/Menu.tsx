function Menu({ click }: { click: () => void }) {
	return (
		<div className="Menu">
			<h2>MINESWEEPER</h2>
			<div>
				<label>Width</label>
				<input id="width" inputMode="numeric" defaultValue={10} />
			</div>
			<div>
				<label>Height</label>
				<input id="height" inputMode="numeric" defaultValue={10} />
			</div>
			<div>
				<label>Bomb count</label>
				<input id="bombs" inputMode="numeric" defaultValue={15} />
			</div>
			<button onClick={click}>New game</button>
		</div>
	);
}

export default Menu;
