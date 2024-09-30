import { createRef } from 'react';

function Menu({ start, values }: { start: (values: BoardValues) => void; values?: BoardValues }) {
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
		<div className="Menu">
			<h2>MINESWEEPER</h2>
			<div>
				<label htmlFor="width">Width</label>
				<input
					onKeyUp={e => next(e.key, 0)}
					id="width"
					inputMode="numeric"
					ref={width}
					defaultValue={values?.width ?? 10}
				/>
			</div>
			<div>
				<label htmlFor="height">Height</label>
				<input
					onKeyUp={e => next(e.key, 1)}
					id="height"
					inputMode="numeric"
					ref={height}
					defaultValue={values?.height ?? 10}
				/>
			</div>
			<div>
				<label htmlFor="bombs">Bombs</label>
				<input
					onKeyUp={e => next(e.key, 2)}
					id="bombs"
					inputMode="numeric"
					ref={bombs}
					defaultValue={values?.bombs ?? 15}
				/>
			</div>
			<button onClick={click}>Start</button>
		</div>
	);
}

export default Menu;
