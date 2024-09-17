import { Component, MouseEvent } from 'react';
import getCaseImage from '../Utils/getCaseImage';

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

	onClick(e: MouseEvent<HTMLDivElement>) {
		if (e.type === 'click') {
			this.mine();
		}
	}

	render() {
		return (
			<div
				onContextMenu={e => {
					this.flag();
					e.preventDefault();
				}}
				onDragStart={e => e.preventDefault()}
				onClick={this.onClick.bind(this)}
				className="case"
			>
				{getCaseImage(this)}
			</div>
		);
	}

	private mine() {
		if (this.getStatus() === 'flagged') return true;

		if (this.isBombed) {
			this.setState({
				status: 'visible'
			});
			return false;
		} else {
			this.setState({
				status: 'visible'
			});
			return true;
		}
	}

	private flag() {
		if (this.getStatus() === 'visible') return;

		if (this.getStatus() === 'flagged') {
			this.setState({
				status: 'hidden'
			});
		} else {
			this.setState({
				status: 'flagged'
			});
		}
	}
}

export default Case;
