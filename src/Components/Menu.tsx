function Menu({ click }: { click: () => void }) {
	function next(key: string, index: number) {
		if (key !== 'Enter') return;
		if (index === 0) {
			document.getElementById('height')?.focus();
		} else if (index === 1) {
			document.getElementById('bombs')?.focus();
		} else {
			click();
		}
	}

	return (
		<div className="Menu">
			<h2>MINESWEEPER</h2>
			<div>
				<label htmlFor="width">Width</label>
				<input onKeyUp={e => next(e.key, 0)} id="width" inputMode="numeric" defaultValue={10} />
			</div>
			<div>
				<label htmlFor="height">Height</label>
				<input onKeyUp={e => next(e.key, 1)} id="height" inputMode="numeric" defaultValue={10} />
			</div>
			<div>
				<label htmlFor="bombs">Bombs</label>
				<input onKeyUp={e => next(e.key, 2)} id="bombs" inputMode="numeric" defaultValue={15} />
			</div>
			<button onClick={click}>Start</button>
		</div>
	);
}

export default Menu;
