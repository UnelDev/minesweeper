import { Component, createRef, RefObject } from 'react';
import getBombs from '../Utils/getBombs';
import Case from './Case';

interface IProps {
	difficulty: difficulty;
}

interface IState {
	time: number;
	nbBombed: number;
}

class Board extends Component<IProps, IState> {
	private boardRef: Array<RefObject<Case>> = [];
	private board: Array<JSX.Element> = [];
	private timeout: NodeJS.Timeout | undefined = undefined;

	constructor(props: IProps) {
		super(props);
		let nbBombed = 0;
		for (let i = 0; i < 100; i++) {
			const isBombed = getBombs(7);
			this.board.push(<Case ref={this.boardRef[i]} isBombed={isBombed} />);
			this.boardRef.push(createRef());
			if (isBombed) {
				nbBombed++;
			}
		}

		this.state = {
			time: 0,
			nbBombed
		};

		this.boardRef.forEach((val, i) => {
			if (val.current?.getBombed()) {
				this.boardRef.at(i - 11)?.current?.increaseProximity();
				this.boardRef.at(i - 10)?.current?.increaseProximity();
				this.boardRef.at(i - 9)?.current?.increaseProximity();
				this.boardRef.at(i - 1)?.current?.increaseProximity();
				this.boardRef.at(i + 1)?.current?.increaseProximity();
				this.boardRef.at(i + 9)?.current?.increaseProximity();
				this.boardRef.at(i + 10)?.current?.increaseProximity();
				this.boardRef.at(i + 11)?.current?.increaseProximity();
			}
		});
	}

	componentDidMount() {
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
					<div className="bombcounter">{this.state.nbBombed}</div>
				</div>
				<div className="Board">{this.board}</div>
			</div>
		);
	}
}

export default Board;
