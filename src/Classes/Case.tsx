import { Component } from 'react';

interface IState {
	status: caseStatus;
}

interface IProps {
	isBombed: boolean;
}

class Case extends Component<IProps, IState> {
	private isBombed: boolean;
	proximity: number;

	constructor(props: IProps) {
		super(props);
		this.isBombed = props.isBombed;
		this.state = { status: 'hidden' };
		this.proximity = 0;
	}

	getStatus() {
		return this.state.status;
	}

	getBombed() {
		return this.isBombed;
	}

	increaseProximity() {
		this.proximity++;
	}
	click(type: string) {
		if (type === 'contextmenu') {
			this.flag();
		} else if (type === 'click') {
			this.mine();
		}
	}
	render() {
		switch (this.state.status) {
			case 'visible':
				return this.showVisible();
			case 'hidden':
				return this.showHidden();
			case 'flagged':
				return this.showFlagged();
			default:
				return <div></div>;
		}
	}

	private mine() {
		if (this.isBombed) {
			return false;
		} else {
			this.setState({
				status: 'visible'
			});
			return true;
		}
	}

	private flag() {
		this.setState({
			status: 'flagged'
		});
		return false;
	}

	private showVisible() {
		return <div className="case caseVisible">{this.proximity}</div>;
	}

	private showHidden() {
		return <div onContextMenu={() => false} onClick={this.mine.bind(this)} className="case caseHidden"></div>;
	}

	private showFlagged() {
		return <div className="case caseFlagged">F</div>;
	}
}

export default Case;
