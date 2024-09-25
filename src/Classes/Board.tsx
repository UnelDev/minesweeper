import { Component, createRef, RefObject } from 'react';

import Case from './Case';
import shuffleBoard from '../Utils/shuffleBoard';
import doNearCases from '../Utils/doNearCases';
import Counter from '../Components/Counter';

interface IProps {
	bombCount: number;
	width: number;
	height: number;
}

interface IState {
	nbBombed: number;
	gameover: String;
}

class Board extends Component<IProps, IState> {
	private boardRef: Array<RefObject<Case>> = [];
	private board: Array<JSX.Element> = [];
	height: number;
	width: number;

	constructor(props: IProps) {
		super(props);

		this.height = this.props.height;
		this.width = this.props.width;

		this.state = {
			nbBombed: this.props.bombCount,
			gameover: ''
		};

		const size = this.height * this.width;
		for (let i = 0; i < size; i++) {
			const isBombed = i < this.props.bombCount;
			this.boardRef.push(createRef());
			this.board.push(
				<Case
					explode={() => {
						this.discoverBombs();
						this.setState({ gameover: 'you lose' });
					}}
					addBombLeft={(value: number) => this.setState({ nbBombed: this.state.nbBombed + value })}
					discover={this.discoverEmptyCases.bind(this)}
					key={i}
					ref={this.boardRef[i]}
					isBombed={isBombed}
				/>
			);
		}

		const { board, boardRef } = shuffleBoard(this.board, this.boardRef);
		this.board = board;
		this.boardRef = boardRef;
	}

	discoverBombs() {
		this.boardRef.forEach(val => {
			const cell = val.current!;
			if (cell.getBombed()) {
				cell.mine({ force: true });
			}
		});
		this.setState({ nbBombed: 0 });
	}

	discoverEmptyCases() {
		const stack = new Array<number>();
		let nbMined = 0;
		this.boardRef.forEach((val, i) => {
			const cell = val.current!;
			if (cell.getStatus() === 'visible') nbMined++;

			if (!cell.getBombed() && cell.proximity === 0 && cell.getStatus() === 'visible') {
				stack.push(i);
			}
		});

		console.log(nbMined);

		if (nbMined === this.height * this.width - this.props.bombCount) {
			this.setState({ gameover: 'you win !!!' });
			return;
		}

		for (let i = 0; i < stack.length; i++) {
			const index = stack[i];
			doNearCases(index, this.width, this.height, (newIndex: number) => {
				const cell = this.boardRef.at(newIndex)?.current!;
				if (cell.getStatus() !== 'hidden') return;
				cell.mine({ force: true });
				if (cell.proximity === 0 && !stack.includes(newIndex)) {
					stack.push(newIndex);
				}
			});
		}
	}

	componentDidMount() {
		this.boardRef.forEach((val, i) => {
			if (val.current?.getBombed()) {
				const callback = (index: number) => {
					this.boardRef.at(index)?.current?.increaseProximity();
				};
				doNearCases(i, this.width, this.height, callback);
			}
		});
	}

	render() {
		return (
			<div className="game">
				<menu>
					<Counter nbBombed={this.state.nbBombed} />
					<div className="text">{this.state.gameover}</div>
				</menu>
				<div
					className="Board"
					style={{
						gridTemplateColumns: `repeat(${this.width}, 1fr)`,
						gridTemplateRows: `repeat(${this.height}, 1fr)`
					}}
				>
					{this.board}
				</div>
			</div>
		);
	}
}

export default Board;
