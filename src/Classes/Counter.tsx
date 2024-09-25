import { Component } from 'react';
import clearTime from '../Utils/clearTime';

type IProps = {
	nbBombed: number;
	start: () => void;
};

type IState = {
	time: number;
	timeout: NodeJS.Timeout | undefined;
};

class Counter extends Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = { time: 0, timeout: undefined };
	}

	componentDidMount(): void {
		this.setState({
			timeout: setInterval(() => {
				this.setState({ time: this.state.time + 1 });
			}, 1000)
		});
	}

	stop() {
		clearInterval(this.state.timeout);
	}

	componentWillUnmount(): void {
		clearInterval(this.state.timeout);
	}
	render() {
		return (
			<div className="Counter">
				<div>
					<div className="timer">Time: {clearTime(this.state.time)}</div>
					<div className="bombCounter">Bomb left: {this.props.nbBombed}</div>
				</div>
				<div>
					<button onClick={this.props.start}>Restart</button>
				</div>
			</div>
		);
	}
}

export default Counter;
