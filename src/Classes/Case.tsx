import { Component, createRef, RefObject } from 'react';
import CaseImageChanger from '../Components/CaseImage';

interface IState {
	status: caseStatus;
}

interface IProps {
	isBombed: boolean;
	discover: () => void;
	addBombLeft: (value: number) => void;
	explode: () => void;
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
				onClick={() => this.mine(false, true, true)}
				className="Case"
			>
				<CaseImageChanger ref={this.imageRef} />
			</div>
		);
	}

	mine(mineFlagged: boolean = false, callExplode: boolean = true, discover: boolean = false) {
		if (!mineFlagged && this.getStatus() === 'flagged') return;

		if (this.isBombed) {
			this.imageRef.current?.changeImage('bomb');
			this.setState({
				status: 'visible'
			});

			// if not called by an explosion we do boom
			if (callExplode) {
				this.props.explode();
			}
			return;
		} else {
			this.imageRef.current?.changeImage(this.proximity.toString());
			this.setState(
				{
					status: 'visible'
				},
				() => {
					if (discover) this.props.discover();
				}
			);
			return;
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
