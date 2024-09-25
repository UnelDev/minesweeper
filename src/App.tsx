import { useState } from 'react';

import Board from './Classes/Board';
import Menu from './Components/Menu';

function App() {
	const [content, setContent] = useState(<Menu click={click} />);

	function start(bombs: number, height: number, width: number) {
		setContent(<Board start={start} bombCount={bombs} height={height} width={width} key={Date.now()} />);
	}

	function click() {
		const bombs = parseInt((document.getElementById('bombs') as HTMLInputElement).value);
		const width = parseInt((document.getElementById('width') as HTMLInputElement).value);
		const height = parseInt((document.getElementById('height') as HTMLInputElement).value);
		start(bombs, height, width);
	}

	return <div className="App">{content}</div>;
}

export default App;
