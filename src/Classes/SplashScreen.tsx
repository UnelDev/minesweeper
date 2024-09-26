import { Component } from 'react';

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

	lose() {
		this.setState({ content: <div className="splashScreen explodeScreen"></div> });
	}

	win() {
		this.setState({ content: <div className="splashScreen winScreen"></div> });
	}

	render() {
		return this.state.content;
	}
}

export default SplashScreen;
