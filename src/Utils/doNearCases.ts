function doNearCases(index: number, width: number, height: number, callback: (index: number) => void) {
	const x = index % width;
	const y = Math.floor(index / width);

	//not in the first row
	if (y !== 0) {
		callback(index - width);
		//not in the first column
		if (x !== 0) {
			callback(index - width - 1);
		}

		//not in the last column
		if (x !== width - 1) {
			callback(index - width + 1);
		}
	}

	//not in the last row
	if (y !== height - 1) {
		callback(index + width);
		//not in the first column
		if (x !== 0) {
			callback(index + width - 1);
		}

		//not in the last column
		if (x !== width - 1) {
			callback(index + width + 1);
		}
	}

	//not in the first column
	if (x !== 0) {
		callback(index - 1);
	}

	//not in the last column
	if (x !== width - 1) {
		callback(index + 1);
	}
}

export default doNearCases;
