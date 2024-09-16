import Case from './Case';
import getBombed from '../Utils/getBombed';
import { useState } from 'react';

class Board {
	private board: Array<Case> = [];
	private nbBonbed = 0;
	constructor(difficulty: difficulty) {
		for (let i = 0; i < 100; i++) {
			const isBonbed = getBombed(7);
			this.board.push(new Case(isBonbed));
			if (isBonbed) {
				this.nbBonbed++;
			}
		}

		this.board.forEach((val, i) => {
			if (val.getBombed()) {
				if (this.board[i - 11]) {
					this.board[i - 11].proximity++;
				}
				if (this.board[i - 10]) {
					this.board[i - 10].proximity++;
				}
				if (this.board[i - 9]) {
					this.board[i - 9].proximity++;
				}
				if (this.board[i - 1]) {
					this.board[i - 1].proximity++;
				}
				if (this.board[i + 1]) {
					this.board[i + 1].proximity++;
				}
				if (this.board[i + 9]) {
					this.board[i + 9].proximity++;
				}
				if (this.board[i + 10]) {
					this.board[i + 10].proximity++;
				}
				if (this.board[i + 11]) {
					this.board[i + 11].proximity++;
				}
			}
		});
	}

	show() {
		return (
			<div className="game">
				<div className="counter">
					<div className="timer"></div>
					<div className="bombcounter"></div>
				</div>
				<div className="Board">{this.board.map((value, i) => value.show(i))}</div>
			</div>
		);
	}
}

export default Board;
