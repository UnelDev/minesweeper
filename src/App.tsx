import { useCallback, useEffect, useState } from 'react';

import Board from './Classes/Board';
import { CustomMenu, Menu } from './Components/Menu';

function App() {
	const [content, setContent] = useState(<></>);

	const start = useCallback((values: BoardValues) => {
		setContent(
			<div className="App">
				<Board start={start} values={values} key={Date.now()} />
			</div>
		);
	}, []);

	const startCustom = useCallback(() => {
		setContent(<CustomMenu start={start} />);
	}, [start]);

	const menu = useCallback(() => {
		setContent(<Menu startCustom={startCustom} start={start} />);
	}, [start, startCustom]);

	useEffect(() => {
		menu();
	}, [menu]);

	return content;
}

export default App;
