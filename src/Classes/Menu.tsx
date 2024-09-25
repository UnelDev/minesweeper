function Menu({ click }: { click: () => void }) {
	return (
		<div className="Menu">
			<h2>MINESWEEPER</h2>
			<input id="width" inputMode="numeric" />
			<input id="height" inputMode="numeric" />
			<input id="bombs" inputMode="numeric" />
			<button onClick={click}>New game</button>
		</div>
	);
}

export default Menu;
