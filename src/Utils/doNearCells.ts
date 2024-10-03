function doNearCells(
	index: number,
	width: number,
	height: number,
	callback: (index: number) => void,
	doAngles: boolean = true
) {
	const x = index % width;
	const y = Math.floor(index / width);

	const notFirstRow = y !== 0;
	const notLastRow = y !== height - 1;
	const notFirstCol = x !== 0;
	const notLastCol = x !== width - 1;

	// Handling adjacent cases
	if (notFirstRow) {
		// Top
		callback(index - width);

		if (doAngles) {
			// Top-left
			if (notFirstCol) callback(index - width - 1);
			// Top-right
			if (notLastCol) callback(index - width + 1);
		}
	}

	if (notLastRow) {
		// Bottom
		callback(index + width);

		if (doAngles) {
			// Bottom-left
			if (notFirstCol) callback(index + width - 1);
			// Bottom-right
			if (notLastCol) callback(index + width + 1);
		}
	}

	// Left
	if (notFirstCol) callback(index - 1);
	// Right
	if (notLastCol) callback(index + 1);
}

export default doNearCells;
