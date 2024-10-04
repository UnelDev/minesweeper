import { PureComponent, createRef, RefObject } from 'react';

import doNearCells from '../Utils/doNearCells';
import shuffleBoard from '../Utils/shuffleBoard';
import Cell from './Cell';
import Counter from './Counter';
import SplashScreen from './SplashScreen';

interface IProps {
	values: BoardValues;
	start: (values: BoardValues) => void;
	menu: () => void;
}

interface IState {
	nbBombed: number;
	CounterRef: RefObject<Counter>;
	SplashRef: RefObject<SplashScreen>;
}

class Board extends PureComponent<IProps, IState> {
	private boardRef = createRef<HTMLDivElement>();
	private cellsRef: Array<RefObject<Cell>> = [];
	private cells: Array<JSX.Element> = [];
	height: number;
	width: number;

	constructor(props: IProps) {
		super(props);

		this.height = this.props.values.height;
		this.width = this.props.values.width;
		this.state = {
			nbBombed: this.props.values.bombs,
			CounterRef: createRef(),
			SplashRef: createRef()
		};

		const size = this.height * this.width;
		for (let i = 0; i < size; i++) {
			const isBombed = i < this.props.values.bombs;
			this.cellsRef.push(createRef());
			this.cells.push(
				<Cell
					explode={this.lose.bind(this)}
					addBombLeft={(value: number) => this.setState({ nbBombed: this.state.nbBombed + value })}
					discover={this.discoverEmptyCells.bind(this)}
					key={i}
					ref={this.cellsRef[i]}
					isBombed={isBombed}
				/>
			);
		}

		const { board, boardRef } = shuffleBoard(this.cells, this.cellsRef);
		this.cells = board;
		this.cellsRef = boardRef;
	}

	lose() {
		this.state.CounterRef.current!.stop();
		this.state.SplashRef.current!.lose(this.state.CounterRef.current!);
		this.explodeBoard();
	}

	win() {
		this.state.CounterRef.current!.stop();
		this.discoverBoard();
		this.state.SplashRef.current!.win();
	}

	explodeBoard() {
		const index = this.cellsRef.findIndex(
			val => val.current?.getBombed() && val.current?.getStatus() === 'discovered'
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
				doNearCells(
					next[i],
					this.width,
					this.height,
					neighborIndex => {
						if (visited.has(neighborIndex)) return;
						this.cellsRef.at(neighborIndex)?.current?.mine(false, false, false);
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
		this.cellsRef.forEach(val => {
			val.current?.mine(false, false, false);
		});
	}

	discoverEmptyCells() {
		const stack = new Array<number>();
		const mined = new Set<number>();
		let nbMined = 0;

		this.cellsRef.forEach((val, i) => {
			const cell = val.current!;
			if (cell.getStatus() === 'discovered') nbMined++;

			if (!cell.getBombed() && cell.getProximity() === 0 && cell.getStatus() === 'discovered') {
				stack.push(i);
			}
		});

		while (stack.length > 0) {
			const index = stack.pop()!;
			let localNbMined = nbMined;

			doNearCells(index, this.width, this.height, (newIndex: number) => {
				if (mined.has(newIndex)) return;
				const cell = this.cellsRef.at(newIndex)?.current!;

				if (cell.getStatus() !== 'full') return;

				mined.add(newIndex);
				localNbMined++;
				cell.mine(false, true, false);

				if (cell.getProximity() === 0) {
					stack.push(newIndex);
				}
			});

			nbMined = localNbMined;
		}

		if (nbMined === this.height * this.width - this.props.values.bombs) {
			this.win();
		}
	}

	componentDidMount() {
		this.boardRef.current!.style.setProperty('--columns', this.width.toString());
		this.boardRef.current!.style.setProperty('--rows', this.height.toString());
		this.cellsRef.forEach((val, i) => {
			if (val.current?.getBombed()) {
				doNearCells(i, this.width, this.height, index => {
					this.cellsRef.at(index)?.current?.increaseProximity();
				});
			}
		});
	}

	render() {
		return (
			<div className="Game">
				<Counter
					menu={() => this.props.menu()}
					start={() => this.props.start(this.props.values)}
					ref={this.state.CounterRef}
					bombLeft={this.state.nbBombed}
				/>
				<div className="BoardContainer">
					<div className="Board" ref={this.boardRef}>
						{this.cells}
					</div>
					<SplashScreen ref={this.state.SplashRef} />
				</div>
			</div>
		);
	}
}

export default Board;
