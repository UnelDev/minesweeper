import { useState } from 'react';

import Board from './Classes/Board';
import Menu from './Components/Menu';

function App() {
	const [content, setContent] = useState(<Menu click={click} />);

	function click() {
		const bombs = parseInt((document.getElementById('bombs') as HTMLInputElement).value);
		const width = parseInt((document.getElementById('width') as HTMLInputElement).value);
		const height = parseInt((document.getElementById('height') as HTMLInputElement).value);
		setContent(<Board bombCount={bombs} height={height} width={width} />);
	}

	return <div className="App">{content}</div>;
}

export default App;
