import { Component } from 'react';

import clearTime from '../Utils/clearTime';
import t from '../Utils/translate';

type IProps = {
	bombLeft: number;
	start: () => void;
	menu: () => void;
};

type IState = {
	time: number;
	timeout: NodeJS.Timeout | undefined;
};

class Counter extends Component<IProps, IState> {
	started: boolean;
	constructor(props: IProps) {
		super(props);
		this.state = { time: 0, timeout: undefined };
		this.started = false;
	}

	getTime(): number {
		return this.state.time;
	}

	start() {
		if (!this.started) {
			this.started = true;
			this.setState({
				timeout: setInterval(() => {
					this.setState({ time: this.state.time + 1 });
				}, 1000)
			});
		}
	}

	stop() {
		clearInterval(this.state.timeout);
	}

	componentWillUnmount(): void {
		this.stop();
	}

	render() {
		return (
			<div className="Counter">
				<div className="CounterText">
					<div className="timer">{t('%t elapsed', { t: clearTime(this.state.time) })}</div>
					<div className="bombCounter">{t('%n bombs left', { n: this.props.bombLeft })}</div>
				</div>
				<div className="Buttons">
					<button onClick={this.props.start}>{t('Restart')}</button>
					<button onClick={this.props.menu}>{t('Go back')}</button>
				</div>
			</div>
		);
	}
}

export default Counter;
