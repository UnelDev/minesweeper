import { useEffect, useState } from 'react';

function Counter({ nbBombed }: { nbBombed: number }) {
	const [time, setTime] = useState(0);

	useEffect(() => {
		const timeout = setInterval(() => {
			setTime(old => old + 1);
		}, 1000);
		return () => {
			clearInterval(timeout);
		};
	}, []);

	return (
		<div className="counter">
			<div className="timer">{time}</div>
			<div className="bombCounter">{nbBombed}</div>
		</div>
	);
}

export default Counter;
