import { Component, createRef, RefObject } from 'react';

import Case from './Case';
import shuffleBoard from '../Utils/shuffleBoard';
import doNearCases from '../Utils/doNearCases';

interface IProps {
	bombCount: number;
	width: number;
	height: number;
}

interface IState {
	time: number;
	nbBombed: number;
}

class Board extends Component<IProps, IState> {
	private boardRef: Array<RefObject<Case>> = [];
	private board: Array<JSX.Element> = [];
	private timeout: NodeJS.Timeout | undefined = undefined;
	height: number;
	width: number;

	constructor(props: IProps) {
		super(props);

		this.height = this.props.height;
		this.width = this.props.width;

		this.state = {
			time: 0,
			nbBombed: this.props.bombCount
		};

		const size = this.height * this.width;
		for (let i = 0; i < size; i++) {
			const isBombed = i < this.props.bombCount;
			this.boardRef.push(createRef());
			this.board.push(
				<Case
					explode={() => {
						this.discoverBombs();
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

		this.boardRef.forEach((val, i) => {
			const cell = val.current!;
			if (!cell.getBombed() && cell.proximity === 0 && cell.getStatus() === 'visible') {
				stack.push(i);
			}
		});

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

		this.timeout = setInterval(() => {
			this.setState({
				time: this.state.time + 1
			});
		}, 1000);
	}

	componentWillUnmount(): void {
		clearInterval(this.timeout);
	}

	render() {
		return (
			<div className="game">
				<div className="counter">
					<div className="timer">{this.state.time}</div>
					<div
						className="bombCounter"
						onContextMenu={() =>
							this.setState({
								nbBombed: this.state.nbBombed - 1
							})
						}
					>
						{this.state.nbBombed}
					</div>
				</div>
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
