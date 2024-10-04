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
			content: <div className="splashScreen explodeScreen">you lose after {clearTime(counter.getTime())}</div>
		});
	}

	win() {
		this.setState({ content: <div className="splashScreen winScreen"></div> });
	}

	render() {
		return this.state.content;
	}
}

export default SplashScreen;
