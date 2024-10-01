import { createRef } from 'react';

function Menu({ startCustom, start }: { startCustom: () => void; start: (values: BoardValues) => void }) {
	return (
		<div className="Menu">
			<h2>MINESWEEPER</h2>
			<div>
				<div onClick={() => start({ width: 9, height: 9, bombs: 10 })}>
					<span>9 x 9</span>
					<span>10 bombs</span>
				</div>
				<div onClick={() => start({ width: 16, height: 16, bombs: 40 })}>
					<span>16 x 16</span>
					<span>40 bombs</span>
				</div>
				<div onClick={() => start({ width: 30, height: 16, bombs: 99 })}>
					<span>30 x 16</span>
					<span>99 bombs</span>
				</div>
				<div onClick={startCustom}>Custom</div>
			</div>
		</div>
	);
}

function CustomMenu({ start }: { start: (values: BoardValues) => void }) {
	const width = createRef<HTMLInputElement>();
	const height = createRef<HTMLInputElement>();
	const bombs = createRef<HTMLInputElement>();

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

	function click() {
		start({
			width: parseInt(width.current!.value),
			height: parseInt(height.current!.value),
			bombs: parseInt(bombs.current!.value)
		});
	}

	return (
		<div className="CustomMenu">
			<h2>Start a custom board</h2>
			<div>
				<label htmlFor="width">Width</label>
				<input onKeyUp={e => next(e.key, 0)} id="width" inputMode="numeric" ref={width} defaultValue={10} />
			</div>
			<div>
				<label htmlFor="height">Height</label>
				<input onKeyUp={e => next(e.key, 1)} id="height" inputMode="numeric" ref={height} defaultValue={10} />
			</div>
			<div>
				<label htmlFor="bombs">Bombs</label>
				<input onKeyUp={e => next(e.key, 2)} id="bombs" inputMode="numeric" ref={bombs} defaultValue={15} />
			</div>
			<button onClick={click}>Start</button>
		</div>
	);
}

export { CustomMenu, Menu };
