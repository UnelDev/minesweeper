function t(value: string, parameters?: { [key: string]: any }) {
	let newValue: string | null = null;
	try {
		newValue = global.t('minesweeper', value);
	} catch (err) {}

	if (!newValue) {
		if (parameters) {
			Object.keys(parameters).forEach(key => {
				value = value.replaceAll('%' + key, parameters[key]);
			});
		}
		return value;
	}

	if (parameters) {
		Object.keys(parameters).forEach(key => {
			newValue = newValue!.replaceAll('%' + key, parameters[key]);
		});
	}

	return newValue;
}

export default t;
