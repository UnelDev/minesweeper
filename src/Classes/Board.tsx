import { Component, createRef, RefObject } from 'react';

import Case from './Case';
import shuffleBoard from '../Utils/shuffleBoard';
import doNearCases from '../Utils/doNearCases';
import Counter from './Counter';
import SplashScreen from './SplashScreen';
import debug from '../Utils/debug';

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
		this.discoverBoard(true);
		this.state.SplashRef.current!.lose();
		this.setState({ gameover: 'You lose !' });
	}

	win() {
		this.state.CounterRef.current!.stop();
		this.discoverBoard(false);
		this.state.SplashRef.current!.win();
		this.setState({ gameover: 'You win !' });
	}

	discoverBoard(mineFlagged: boolean) {
		if (mineFlagged) {
			// Find the first visible cell that contains a bomb
			const index = this.boardRef.findIndex(
				val => val.current?.getBombed() && val.current?.getStatus() === 'visible'
			);

			// If no bomb is found (to avoid errors)
			if (index === -1) {
				return;
			}

			// Calculate the x and y coordinates of the bomb (center of explosion)
			const bombX = Math.floor(index / this.width); // X position
			const bombY = index % this.width; // Y position
			const maxRadius = Math.ceil(Math.sqrt(this.width * this.width + this.height * this.height)); // Maximum radius based on the grid size

			let radius = 0;

			// Trigger a "wave" propagation starting from the center of the explosion
			const interval = setInterval(() => {
				for (let i = -radius; i <= radius; i++) {
					// Target only cells at the exact distance of the current radius (Manhattan distance)
					for (let j = -radius; j <= radius; j++) {
						if (Math.abs(i) + Math.abs(j) === radius) {
							const targetX = bombX + i;
							const targetY = bombY + j;

							// Check if the coordinates are within grid limits
							if (targetX >= 0 && targetX < this.height && targetY >= 0 && targetY < this.width) {
								const targetIndex = targetX * this.width + targetY; // Calculate linear index

								// If the cell is not yet revealed
								if (this.boardRef[targetIndex]?.current?.getStatus() !== 'visible') {
									// Trigger the "mine" action on the cell
									this.boardRef[targetIndex]?.current?.mine(mineFlagged, false, false);
								}
							}
						}
					}
				}

				// Increase the radius for the next iteration
				radius++;

				// Stop the propagation once the wave covers the entire grid
				if (radius > maxRadius) {
					clearInterval(interval);
				}
			}, 80);
		} else {
			// Reveal all cells if the game is won
			this.boardRef.forEach(val => {
				val.current?.mine(false, false, false);
			});
		}
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

		const mined = new Array<number>();
		for (let i = 0; i < stack.length; i++) {
			const index = stack[i];
			let localNbMined = nbMined;
			doNearCases(index, this.width, this.height, (newIndex: number) => {
				const cell = this.boardRef.at(newIndex)?.current!;
				if (cell.getStatus() !== 'hidden' || mined.includes(newIndex)) return;
				mined.push(newIndex);
				localNbMined++;
				cell.mine(false, true, false);
				if (cell.proximity === 0 && !stack.includes(newIndex)) {
					stack.push(newIndex);
				}
			});
			nbMined = localNbMined;
		}

		if (nbMined === this.height * this.width - this.props.bombCount) {
			this.win();
			return;
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

	restart() {
		this.props.start(this.props.bombCount, this.height, this.width);
	}

	render() {
		return (
			<div className="game">
				<menu>
					<Counter start={() => this.restart()} ref={this.state.CounterRef} nbBombed={this.state.nbBombed} />
					<div className="text">{this.state.gameover}</div>
				</menu>
				<div className="BoardContainer">
					<div
						className="Board"
						style={{
							gridTemplateColumns: `repeat(${this.width}, 1fr)`,
							gridTemplateRows: `repeat(${this.height}, 1fr)`
						}}
					>
						{this.board}
					</div>
					<SplashScreen ref={this.state.SplashRef} />
				</div>
			</div>
		);
	}
}

export default Board;
