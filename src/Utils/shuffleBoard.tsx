import { RefObject } from 'react';

import Cell from '../Classes/Cell';

function shuffleBoard(board: Array<JSX.Element>, boardRef: Array<RefObject<Cell>>) {
	let currentIndex = board.length;

	while (currentIndex !== 0) {
		let randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		[board[currentIndex], board[randomIndex]] = [board[randomIndex], board[currentIndex]];
		[boardRef[currentIndex], boardRef[randomIndex]] = [boardRef[randomIndex], boardRef[currentIndex]];
	}

	return { board: board, boardRef: boardRef };
}

export default shuffleBoard;
