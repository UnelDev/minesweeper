function getBombs(density: number) {
	return Math.random() * density <= 1;
}

export default getBombs;
