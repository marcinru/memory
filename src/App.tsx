import { useState } from 'react';
import './App.css';

const COLORS = ['red', 'green', 'blue', 'yellow'];

function App() {
  const [board, setBoard] = useState(() => [...COLORS, ...COLORS]);
  const resetGame = () => setBoard([...COLORS, ...COLORS]);

  return (
    <>
      <h1>Memory</h1>
      {board.map((color, index) => (
        <div key={index} className="card">
          {color}
        </div>
      ))}
      <button onClick={() => resetGame}>Reset</button>
    </>
  );
}

export default App;
