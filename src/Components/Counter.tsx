import { useEffect, useState } from 'react';
import clearTime from '../Utils/clearTime';

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
			<div className="timer">Time: {clearTime(time)}</div>
			<div className="bombCounter">Bomb left: {nbBombed}</div>
		</div>
	);
}

export default Counter;
