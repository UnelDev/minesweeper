import { Component, createRef, RefObject } from 'react';
import CaseImageChanger from '../Components/CaseImage';

interface IState {
	status: caseStatus;
}

interface IProps {
	isBombed: boolean;
	discover: () => void;
	addBombLeft: (value: number) => void;
}

class Case extends Component<IProps, IState> {
	private isBombed: boolean;
	proximity: number;
	imageRef: RefObject<CaseImageChanger>;

	constructor(props: IProps) {
		super(props);
		this.isBombed = props.isBombed;
		this.state = { status: 'hidden' };
		this.proximity = 0;
		this.imageRef = createRef();
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

	render() {
		return (
			<div
				onContextMenu={e => {
					this.flag();
					e.preventDefault();
				}}
				onDragStart={e => e.preventDefault()}
				onClick={() => this.mine({ force: false })}
				className="case"
			>
				<CaseImageChanger ref={this.imageRef} />
			</div>
		);
	}

	/**
	 * @param force - If true, the case will be mined even if it is flagged
	 */
	mine({ force }: { force: boolean }) {
		if (!force && this.getStatus() === 'flagged') return true;

		if (this.isBombed) {
			this.imageRef.current?.changeImage('bomb');
			this.setState({
				status: 'visible'
			});
			return false;
		} else {
			this.imageRef.current?.changeImage(this.proximity.toString());
			this.setState(
				{
					status: 'visible'
				},
				() => {
					if (!force) this.props.discover();
				}
			);
			return true;
		}
	}

	private flag() {
		if (this.getStatus() === 'visible') return;

		if (this.getStatus() === 'flagged') {
			this.imageRef.current?.changeImage('full');
			this.props.addBombLeft(1);
			this.setState({
				status: 'hidden'
			});
		} else {
			this.imageRef.current?.changeImage('flag');
			this.props.addBombLeft(-1);
			this.setState({
				status: 'flagged'
			});
		}
	}
}

export default Case;
