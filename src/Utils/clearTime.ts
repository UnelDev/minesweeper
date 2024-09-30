function clearTime(time: number) {
	const seconds = time % 60;
	const minutes = Math.floor((time / 60) % 60);
	const hours = Math.floor(time / 3600);

	if (hours) {
		return (
			hours +
			'h ' +
			(minutes ? minutes + (minutes === 1 ? 'min ' : 'mins ') : '') +
			(seconds ? seconds + 's' : '')
		);
	} else if (minutes) {
		return minutes + (minutes === 1 ? 'min ' : 'mins ') + (seconds ? seconds + 's' : '');
	} else {
		return seconds + 's';
	}
}

export default clearTime;
