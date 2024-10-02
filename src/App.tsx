import { useEffect, useState } from 'react';

import Board from './Classes/Board';
import { CustomMenu, Menu } from './Components/Menu';

function App() {
	const [content, setContent] = useState(<></>);

	useEffect(() => {
		function startCustom() {
			setContent(<CustomMenu start={start} />);
		}

		function start(values: BoardValues) {
			setContent(
				<div className="App">
					<Board menu={menu} start={start} values={values} key={Date.now()} />
				</div>
			);
		}

		function menu() {
			setContent(<Menu startCustom={startCustom} start={start} />);
		}

		menu();
	}, []);

	return content;
}

export default App;
