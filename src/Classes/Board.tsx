import { PureComponent, createRef, RefObject } from 'react';

import doNearCases from '../Utils/doNearCases';
import shuffleBoard from '../Utils/shuffleBoard';
import Case from './Case';
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
	private casesRef: Array<RefObject<Case>> = [];
	private cases: Array<JSX.Element> = [];
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
			this.casesRef.push(createRef());
			this.cases.push(
				<Case
					explode={this.lose.bind(this)}
					addBombLeft={(value: number) => this.setState({ nbBombed: this.state.nbBombed + value })}
					discover={this.discoverEmptyCases.bind(this)}
					key={i}
					ref={this.casesRef[i]}
					isBombed={isBombed}
				/>
			);
		}

		const { board, boardRef } = shuffleBoard(this.cases, this.casesRef);
		this.cases = board;
		this.casesRef = boardRef;
	}

	lose() {
		this.state.CounterRef.current!.stop();
		this.state.SplashRef.current!.lose();
		this.explodeBoard();
	}

	win() {
		this.state.CounterRef.current!.stop();
		this.discoverBoard();
		this.state.SplashRef.current!.win();
	}

	explodeBoard() {
		const index = this.casesRef.findIndex(
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
						this.casesRef.at(neighborIndex)?.current?.mine(false, false, false);
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
		this.casesRef.forEach(val => {
			val.current?.mine(false, false, false);
		});
	}

	discoverEmptyCases() {
		const stack = new Array<number>();
		const mined = new Set<number>();
		let nbMined = 0;

		this.casesRef.forEach((val, i) => {
			const cell = val.current!;
			if (cell.getStatus() === 'visible') nbMined++;

			if (!cell.getBombed() && cell.getProximity() === 0 && cell.getStatus() === 'visible') {
				stack.push(i);
			}
		});

		while (stack.length > 0) {
			const index = stack.pop()!;
			let localNbMined = nbMined;

			doNearCases(index, this.width, this.height, (newIndex: number) => {
				if (mined.has(newIndex)) return;
				const cell = this.casesRef.at(newIndex)?.current!;

				if (cell.getStatus() !== 'hidden') return;

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
		this.casesRef.forEach((val, i) => {
			if (val.current?.getBombed()) {
				doNearCases(i, this.width, this.height, index => {
					this.casesRef.at(index)?.current?.increaseProximity();
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
					nbBombed={this.state.nbBombed}
				/>
				<div className="BoardContainer">
					<div className="Board" ref={this.boardRef}>
						{this.cases}
					</div>
					<SplashScreen ref={this.state.SplashRef} />
				</div>
			</div>
		);
	}
}

export default Board;
