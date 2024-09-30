import { PureComponent, createRef, RefObject } from 'react';

import CaseImageChanger from '../Components/CaseImage';
import ParticleExplosion from './Particles';

interface IState {
	status: caseStatus;
	particles: JSX.Element;
}

interface IProps {
	isBombed: boolean;
	discover: () => void;
	addBombLeft: (value: number) => void;
	explode: () => void;
}

class Case extends PureComponent<IProps, IState> {
	private isBombed: boolean;
	private proximity: number;
	imageRef: RefObject<CaseImageChanger>;

	constructor(props: IProps) {
		super(props);
		this.isBombed = props.isBombed;
		this.state = { status: 'hidden', particles: <></> };
		this.proximity = 0;
		this.imageRef = createRef();
	}

	getProximity() {
		return this.proximity;
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

	mine(
		mineFlagged: boolean = false,
		callExplode: boolean = true,
		discover: boolean = false,
		e: { x: number; y: number } | undefined = undefined
	) {
		if ((!mineFlagged && this.getStatus() === 'flagged') || this.getStatus() === 'visible') return;

		if (this.isBombed) {
			this.changeImage('bomb');

			this.setState({ status: 'visible' }, () => {
				if (callExplode) {
					this.props.explode();
					if (e) {
						this.setState({ particles: <ParticleExplosion e={e} /> });
						this.props.explode();
					}
				}
			});
		} else {
			this.changeImage(this.proximity.toString());

			this.setState({ status: 'visible' }, () => {
				if (discover) {
					this.props.discover();
				}
			});
		}
	}

	private flag() {
		if (this.getStatus() === 'visible') return;

		if (this.getStatus() === 'flagged') {
			this.changeImage('full');
			this.props.addBombLeft(1);
			this.setState({
				status: 'hidden'
			});
		} else {
			this.changeImage('flag');
			this.props.addBombLeft(-1);
			this.setState({
				status: 'flagged'
			});
		}
	}

	private changeImage(image: string) {
		this.imageRef.current!.changeImage(image);
	}

	handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
		this.flag();
		e.preventDefault();
	};

	preventDrag = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

	handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		this.mine(false, true, true, { x: e.clientX, y: e.clientY });
	};

	render() {
		return (
			<div
				onContextMenu={this.handleContextMenu}
				onDragStart={this.preventDrag}
				onClick={this.handleClick}
				className="Case"
			>
				<CaseImageChanger ref={this.imageRef} />
				{this.state.particles}
			</div>
		);
	}
}

export default Case;
