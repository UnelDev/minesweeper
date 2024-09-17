import Case from '../Classes/Case';

function getCaseImage(element: Case) {
	if (element.getStatus() === 'visible' && element.getBombed()) {
		return <img alt="Game case" src="/Assets/bomb.png" />;
	}

	if (element.getStatus() === 'flagged') {
		return <img alt="Game case" src="/Assets/flag.png" />;
	}

	if (element.getStatus() === 'hidden') {
		return <img alt="Game case" src="/Assets/full.png" />;
	}

	switch (element.proximity) {
		case 0:
			return <img alt="Game case" src="/Assets/0.png" />;
		case 1:
			return <img alt="Game case" src="/Assets/1.png" />;
		case 2:
			return <img alt="Game case" src="/Assets/2.png" />;
		case 3:
			return <img alt="Game case" src="/Assets/3.png" />;
		case 4:
			return <img alt="Game case" src="/Assets/4.png" />;
		case 5:
			return <img alt="Game case" src="/Assets/5.png" />;
		case 6:
			return <img alt="Game case" src="/Assets/6.png" />;
		case 7:
			return <img alt="Game case" src="/Assets/7.png" />;
		case 8:
			return <img alt="Game case" src="/Assets/8.png" />;
	}

	return <img alt="Game case" src="/Assets/full.png" />;
}

export default getCaseImage;
