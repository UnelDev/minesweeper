import { Component, createElement, ReactElement } from 'react';

interface IState {
	images: Map<string, ReactElement>;
	currentImage: string;
}

interface IProps {}

class CaseImageChanger extends Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			currentImage: 'full',
			images: new Map()
		};
	}

	componentDidMount() {
		this.preloadImages(
			new Map([
				['/Assets/0.png', '0'],
				['/Assets/1.png', '1'],
				['/Assets/2.png', '2'],
				['/Assets/3.png', '3'],
				['/Assets/4.png', '4'],
				['/Assets/5.png', '5'],
				['/Assets/6.png', '6'],
				['/Assets/7.png', '7'],
				['/Assets/8.png', '8'],
				['/Assets/bomb.png', 'bomb'],
				['/Assets/flag.png', 'flag'],
				['/Assets/full.png', 'full']
			])
		);
	}

	preloadImages(imageList: Map<string, string>) {
		const images = new Map<string, ReactElement>();
		imageList.forEach((id, imageSrc) => {
			const img = createElement('img', { src: imageSrc });
			images.set(id, img);
		});
		this.setState({ images });
	}

	changeImage(imageId: string) {
		if (this.state.images.get(imageId)) {
			this.setState({ currentImage: imageId });
		}
	}

	private getCurrentImage() {
		return this.state.images.get(this.state.currentImage) ?? <></>;
	}

	render() {
		return <>{this.getCurrentImage()}</>;
	}
}

export default CaseImageChanger;
