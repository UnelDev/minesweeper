import { Component, createRef, RefObject } from 'react';

import getBombs from '../Utils/getBombs';
import Case from './Case';

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

	constructor(props: IProps) {
		super(props);
		let nbBombed = 0;
		const size = this.props.height * this.props.width;
		for (let i = 0; i < size; i++) {
			const isBombed = getBombs(7);
			this.boardRef.push(createRef());
			this.board.push(<Case key={i} ref={this.boardRef[i]} isBombed={isBombed} />);
			if (isBombed) {
				nbBombed++;
			}
		}

		this.state = {
			time: 0,
			nbBombed: nbBombed
		};
	}

	increaseCaseProximity(index: number) {
		if (index < 0) return;
		this.boardRef.at(index)?.current?.increaseProximity();
	}

	componentDidMount() {
		this.boardRef.forEach((val, i) => {
			if (val.current?.getBombed()) {
				const x = i % this.props.width;
				const y = parseInt((i / this.props.width).toFixed());

				if (y !== 0) {
					this.increaseCaseProximity(i - this.props.width);
					if (x !== 0) {
						this.increaseCaseProximity(i - this.props.width - 1);
					}

					if (x !== this.props.width - 1) {
						this.increaseCaseProximity(i - this.props.width + 1);
					}
				}

				if (y !== this.props.height - 1) {
					this.increaseCaseProximity(i + this.props.width);
					if (x !== 0) {
						this.increaseCaseProximity(i + this.props.width - 1);
					}

					if (x !== this.props.width - 1) {
						this.increaseCaseProximity(i + this.props.width + 1);
					}
				}

				if (x !== 0) {
					this.increaseCaseProximity(i - 1);
				}

				if (x !== this.props.width - 1) {
					this.increaseCaseProximity(i + 1);
				}
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
						gridTemplateColumns: `repeat(${this.props.width}, 1fr)`,
						gridTemplateRows: `repeat(${this.props.height}, 1fr)`
					}}
				>
					{this.board}
				</div>
			</div>
		);
	}
}

export default Board;
