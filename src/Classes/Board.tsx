import { Component, createRef, RefObject } from 'react';

import doNearCases from '../Utils/doNearCases';
import shuffleBoard from '../Utils/shuffleBoard';
import Case from './Case';
import Counter from './Counter';
import SplashScreen from './SplashScreen';

interface IProps {
	bombCount: number;
	width: number;
	height: number;
	start: (bombs: number, height: number, width: number) => void;
}

interface IState {
	nbBombed: number;
	gameover: string;
	CounterRef: RefObject<Counter>;
	SplashRef: RefObject<SplashScreen>;
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
			gameover: '',
			CounterRef: createRef(),
			SplashRef: createRef()
		};

		const size = this.height * this.width;
		for (let i = 0; i < size; i++) {
			const isBombed = i < this.props.bombCount;
			this.boardRef.push(createRef());
			this.board.push(
				<Case
					explode={this.lose.bind(this)}
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

	lose() {
		this.state.CounterRef.current!.stop();
		this.state.SplashRef.current!.lose();
		this.explodeBoard();
		this.setState({ gameover: 'You lose !' });
	}

	win() {
		this.state.CounterRef.current!.stop();
		this.discoverBoard();
		this.state.SplashRef.current!.win();
		this.setState({ gameover: 'You win !' });
	}

	explodeBoard() {
		const index = this.boardRef.findIndex(
			val => val.current?.getBombed() && val.current?.getStatus() === 'visible'
		);

		if (index === -1) return;

		const next = [index];
		const visited = new Set(next);
		let i = 0;
		let lastTimestamp = 0;
		const delay = 80;

		const processGeneration = (timestamp: number) => {
			if (timestamp - lastTimestamp < delay) {
				requestAnimationFrame(processGeneration);
				return;
			}
			lastTimestamp = timestamp;

			const newGeneration = new Array<number>();

			while (i < next.length) {
				doNearCases(
					next[i],
					this.width,
					this.height,
					neighborIndex => {
						if (visited.has(neighborIndex)) return;
						this.boardRef.at(neighborIndex)?.current?.mine(false, false, false);
						newGeneration.push(neighborIndex);
						visited.add(neighborIndex);
					},
					false
				);
				i++;
			}

			if (newGeneration.length === 0) {
				return;
			} else {
				next.push(...newGeneration);
				i = 0;
				requestAnimationFrame(processGeneration);
			}
		};

		requestAnimationFrame(processGeneration);
	}

	discoverBoard() {
		this.boardRef.forEach(val => {
			val.current?.mine(false, false, false);
		});
	}

	discoverEmptyCases() {
		const stack = new Array<number>();
		let nbMined = 0;
		const mined = new Set<number>();

		this.boardRef.forEach((val, i) => {
			const cell = val.current!;
			if (cell.getStatus() === 'visible') nbMined++;

			if (!cell.getBombed() && cell.proximity === 0 && cell.getStatus() === 'visible') {
				stack.push(i);
			}
		});

		while (stack.length > 0) {
			const index = stack.pop()!;
			let localNbMined = nbMined;

			doNearCases(index, this.width, this.height, (newIndex: number) => {
				if (mined.has(newIndex)) return;
				const cell = this.boardRef.at(newIndex)?.current!;

				if (cell.getStatus() !== 'hidden') return;

				mined.add(newIndex);
				localNbMined++;
				cell.mine(false, true, false);

				if (cell.proximity === 0) {
					stack.push(newIndex);
				}
			});

			nbMined = localNbMined;
		}

		if (nbMined === this.height * this.width - this.props.bombCount) {
			this.win();
		}
	}

	componentDidMount() {
		(document.querySelector('.Board') as HTMLDivElement).style.setProperty('--columns', this.width.toString());
		(document.querySelector('.Board') as HTMLDivElement).style.setProperty('--columns', this.height.toString());
		this.boardRef.forEach((val, i) => {
			if (val.current?.getBombed()) {
				doNearCases(i, this.width, this.height, index => {
					this.boardRef.at(index)?.current?.increaseProximity();
				});
			}
		});
	}

	restart() {
		this.props.start(this.props.bombCount, this.height, this.width);
	}

	render() {
		return (
			<div className="Game">
				<div className="CounterContainer">
					<Counter start={() => this.restart()} ref={this.state.CounterRef} nbBombed={this.state.nbBombed} />
					<div>{this.state.gameover}</div>
				</div>
				<div className="BoardContainer">
					<div className="Board">{this.board}</div>
					<SplashScreen ref={this.state.SplashRef} />
				</div>
			</div>
		);
	}
}

export default Board;
