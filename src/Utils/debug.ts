import { RefObject } from 'react';
import Case from '../Classes/Case';

export default function debug(boardRef: Array<RefObject<Case>>, height: number, width: number) {
	const board = Array<Array<RefObject<Case>>>();
	for (let i = 0; i < height; i++) {
		const row = new Array<RefObject<Case>>();
		for (let j = 0; j < width; j++) {
			row.push(boardRef[i * width + j]);
		}
		board.push(row);
	}
	console.log(
		'Board:\n' +
			board
				.map(row => row.map(cell => (cell.current!.getStatus() === 'visible' ? 'X' : 'O')).join(' '))
				.join('\n')
	);
}
