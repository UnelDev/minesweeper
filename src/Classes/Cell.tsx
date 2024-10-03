import { PureComponent, createRef, RefObject } from 'react';

import CellImageChanger from '../Components/CellImageChanger';
import ParticleExplosion from './Particles';

interface IState {
	status: cellStatus;
	particles: JSX.Element;
}

interface IProps {
	isBombed: boolean;
	discover: () => void;
	addBombLeft: (value: number) => void;
	explode: () => void;
}

class Cell extends PureComponent<IProps, IState> {
	private isBombed: boolean;
	private proximity: number;
	private imageRef: RefObject<CellImageChanger>;

	constructor(props: IProps) {
		super(props);
		this.isBombed = props.isBombed;
		this.state = { status: 'full', particles: <></> };
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
		if ((!mineFlagged && this.getStatus() === 'flagged') || this.getStatus() === 'discovered') return;

		if (this.isBombed) {
			this.changeImage('bomb');

			this.setState({ status: 'discovered' }, () => {
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

			this.setState({ status: 'discovered' }, () => {
				if (discover) {
					this.props.discover();
				}
			});
		}
	}

	private flag() {
		if (this.getStatus() === 'discovered') return;

		if (this.getStatus() === 'flagged') {
			this.changeImage('full');
			this.props.addBombLeft(1);
			this.setState({
				status: 'full'
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

	private handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
		this.flag();
		e.preventDefault();
	};

	private preventDrag = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

	private handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		this.mine(false, true, true, { x: e.clientX, y: e.clientY });
	};

	render() {
		return (
			<div
				onContextMenu={this.handleContextMenu}
				onDragStart={this.preventDrag}
				onClick={this.handleClick}
				className="Cell"
			>
				<CellImageChanger ref={this.imageRef} />
				{this.state.particles}
			</div>
		);
	}
}

export default Cell;
