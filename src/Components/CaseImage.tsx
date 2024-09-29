import { PureComponent, createElement, ReactElement } from 'react';

interface IState {
	images: Map<string, ReactElement>;
	currentImage: string;
}

interface IProps {}

class CaseImageChanger extends PureComponent<IProps, IState> {
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
				['0', '0.png'],
				['1', '1.png'],
				['2', '2.png'],
				['3', '3.png'],
				['4', '4.png'],
				['5', '5.png'],
				['6', '6.png'],
				['7', '7.png'],
				['8', '8.png'],
				['bomb', 'bomb.png'],
				['flag', 'flag.png'],
				['full', 'full.png']
			])
		);
	}

	preloadImages(imageList: Map<string, string>) {
		const images = new Map<string, ReactElement>();
		imageList.forEach((src, id) => {
			const img = createElement('img', { src: `Assets/${src}` });
			images.set(id, img);
		});
		this.setState({ images });
	}

	changeImage(imageId: string) {
		const newImage = this.state.images.get(imageId);
		if (!newImage || imageId === this.state.currentImage) return;
		this.setState({ currentImage: imageId });
	}

	private getCurrentImage() {
		return this.state.images.get(this.state.currentImage) || null;
	}

	render() {
		return this.getCurrentImage();
	}
}

export default CaseImageChanger;
