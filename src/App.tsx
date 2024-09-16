import Board from './Classes/Board';

function App() {
	const board = new Board('medium');
	return <div className="App">{board.show()}</div>;
}

export default App;
