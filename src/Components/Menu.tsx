import { createRef } from 'react';

import t from '../Utils/translate';

const ERROR_BORDER = '2px solid var(--color-error-text)';

function Menu({ startCustom, start }: { startCustom: () => void; start: (values: BoardValues) => void }) {
	return (
		<div className="Menu">
			<h2>{t('MINESWEEPER')}</h2>
			<div>
				<button onClick={() => start({ width: 9, height: 9, bombs: 10 })}>
					<span>9 x 9</span>
					<span>{t('%n bombs', { n: 10 })}</span>
				</button>
				<button onClick={() => start({ width: 16, height: 16, bombs: 40 })}>
					<span>16 x 16</span>
					<span>{t('%n bombs', { n: 40 })}</span>
				</button>
				<button onClick={() => start({ width: 30, height: 16, bombs: 99 })}>
					<span>30 x 16</span>
					<span>{t('%n bombs', { n: 99 })}</span>
				</button>
				<button onClick={startCustom}>{t('Custom')}</button>
			</div>
		</div>
	);
}

function CustomMenu({ start, menu }: { start: (values: BoardValues) => void; menu: () => void }) {
	const width = createRef<HTMLInputElement>();
	const height = createRef<HTMLInputElement>();
	const bombs = createRef<HTMLInputElement>();

	function next(key: string, index: number) {
		if (index === 0) width.current!.style.border = '';
		if (index === 1) height.current!.style.border = '';
		if (index === 2) bombs.current!.style.border = '';
		if (key !== 'Enter') return;

		if (index === 0) {
			document.getElementById('height')?.focus();
		} else if (index === 1) {
			document.getElementById('bombs')?.focus();
		} else {
			click();
		}
	}

	function checkValues() {
		const w = parseInt(width.current!.value);
		const h = parseInt(height.current!.value);
		const b = parseInt(bombs.current!.value);
		let errored = false;

		if (isNaN(w) || w <= 0) {
			width.current!.style.border = ERROR_BORDER;
			errored = true;
		}

		if (isNaN(h) || h <= 0) {
			height.current!.style.border = ERROR_BORDER;
			errored = true;
		}

		if (w * h <= b || isNaN(b)) {
			bombs.current!.style.border = ERROR_BORDER;
			errored = true;
		}
		return errored;
	}

	function click() {
		if (checkValues()) return;
		start({
			width: parseInt(width.current!.value),
			height: parseInt(height.current!.value),
			bombs: parseInt(bombs.current!.value)
		});
	}

	return (
		<div className="CustomMenu">
			<h2>{t('Set a custom board')}</h2>
			<div>
				<label htmlFor="width">{t('Width')}</label>
				<input onKeyUp={e => next(e.key, 0)} id="width" inputMode="numeric" ref={width} defaultValue={10} />
			</div>
			<div>
				<label htmlFor="height">{t('Height')}</label>
				<input onKeyUp={e => next(e.key, 1)} id="height" inputMode="numeric" ref={height} defaultValue={10} />
			</div>
			<div>
				<label htmlFor="bombs">{t('Bombs')}</label>
				<input onKeyUp={e => next(e.key, 2)} id="bombs" inputMode="numeric" ref={bombs} defaultValue={15} />
			</div>
			<button onClick={click}>{t('Start')}</button>
			<button onClick={menu}>{t('Go back')}</button>
		</div>
	);
}

export { CustomMenu, Menu };
