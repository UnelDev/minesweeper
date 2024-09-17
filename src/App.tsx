import Board from './Classes/Board';

function App() {
	return (
		<div className="App">
			<Board bombCount={5} height={10} width={10} />
		</div>
	);
}

export default App;
