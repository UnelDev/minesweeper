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
				['0.png', '0'],
				['1.png', '1'],
				['2.png', '2'],
				['3.png', '3'],
				['4.png', '4'],
				['5.png', '5'],
				['6.png', '6'],
				['7.png', '7'],
				['8.png', '8'],
				['bomb.png', 'bomb'],
				['flag.png', 'flag'],
				['full.png', 'full']
			])
		);
	}

	preloadImages(imageList: Map<string, string>) {
		const images = new Map<string, ReactElement>();
		imageList.forEach((id, imageSrc) => {
			const img = createElement('img', { src: 'Assets/' + imageSrc });
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
