import { Component } from 'react';
import Counter from './Counter';
import clearTime from '../Utils/clearTime';

interface IProps {}

interface IState {
	content: JSX.Element;
}

class SplashScreen extends Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);

		this.state = {
			content: <></>
		};
	}

	lose(counter: Counter) {
		this.setState({
			content: <div className="splashScreen explodeScreen">You lose after {clearTime(counter.getTime())}</div>
		});
	}

	win(counter: Counter) {
		this.setState({
			content: <div className="splashScreen winScreen">You win in {clearTime(counter.getTime())}</div>
		});
	}

	render() {
		return this.state.content;
	}
}

export default SplashScreen;
