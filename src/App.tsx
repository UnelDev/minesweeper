import { useCallback, useEffect, useState } from 'react';

import Board from './Classes/Board';
import Menu from './Components/Menu';

function App() {
	const [content, setContent] = useState(<></>);

	const start = useCallback((values: BoardValues) => {
		setContent(
			<div className="App">
				<Board
					start={start}
					bombCount={values.bombs}
					height={values.height}
					width={values.width}
					key={Date.now()}
				/>
			</div>
		);
	}, []);

	const menu = useCallback(
		(values?: BoardValues) => {
			setContent(<Menu values={values} start={start} />);
		},
		[start]
	);

	useEffect(() => {
		menu();
	}, [menu]);

	return content;
}

export default App;
