import { useState } from 'react';
import './App.css';

const COLORS = ['red', 'green', 'blue', 'yellow'];

function App() {
  const [board, setBoard] = useState(() => shuffle([...COLORS, ...COLORS]));
  const resetGame = () => setBoard(shuffle([...COLORS, ...COLORS]));

  return (
    <>
      <h1>Memory</h1>
      <div className="board">
        {board.map((color, index) => (
          <div key={index} className="tile">
            {color}
          </div>
        ))}
        <button onClick={resetGame}>Reset</button>
      </div>
    </>
  );
}

function shuffle(array: string[]): string[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default App;
