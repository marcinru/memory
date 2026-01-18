import { useState } from 'react';
import './App.css';

const COLORS = ['red', 'green', 'blue', 'yellow'];

function App() {
  const [board, setBoard] = useState(() => shuffle([...COLORS, ...COLORS]));
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);

  const resetGame = () => setBoard(shuffle([...COLORS, ...COLORS]));

  const handleClick = (index: number) => {
    if (selectedTiles.includes(index)) {
      setSelectedTiles(selectedTiles.filter((i) => i !== index));
    } else {
      setSelectedTiles([...selectedTiles, index]);
    }
  };

  return (
    <>
      <h1>Memory</h1>
      <div className="board">
        {board.map((color, index) => {
          const isSelected = selectedTiles.includes(index);
          const tileClass = isSelected ? `tile ${color}` : `tile`;

          return (
            <div
              onClick={() => handleClick(index)}
              key={index}
              className={tileClass}
            />
          );
        })}
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
