function clearTime(time: number) {
	const seconds = time % 60;
	const minutes = Math.floor(time / 60);

	if (minutes) {
		if (seconds) {
			return minutes + (minutes === 1 ? 'min ' : 'mins ') + seconds;
		} else {
			return minutes + (minutes === 1 ? 'min' : 'mins');
		}
	} else {
		return seconds + 's';
	}
}

export default clearTime;
