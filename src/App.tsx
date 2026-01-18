import { useState } from 'react';
import './App.css';

const COLORS = ['red', 'green', 'blue', 'yellow'];

export function App() {
  const [board, setBoard] = useState(() => shuffle([...COLORS, ...COLORS]));
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [matchedTiles, setMatchedTiles] = useState<number[]>([]);

  const resetGame = () => {
    setBoard(shuffle([...COLORS, ...COLORS]));
    setSelectedTiles([]);
    setMatchedTiles([]);
  };

  const handleClick = (index: number) => {
    if (selectedTiles.length >= 2) {
      setSelectedTiles([index]);
      return;
    }

    if (selectedTiles.includes(index)) {
      setSelectedTiles(selectedTiles.filter((i) => i !== index));
      return;
    }

    const newSelected = [...selectedTiles, index];
    setSelectedTiles(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      if (board[first] === board[second]) {
        setMatchedTiles((prev) => [...prev, first, second]);
        setSelectedTiles([]);
      } else {
        setTimeout(() => setSelectedTiles([]), 500);
      }
    }
  };

  return (
    <>
      <h1>{matchedTiles.length === 8 ? 'You Win!' : 'Memory'}</h1>
      <div className="board">
        {board.map((color, index) => {
          const isTurnedOver =
            selectedTiles.includes(index) || matchedTiles.includes(index);
          const tileClass = isTurnedOver ? `tile ${color}` : `tile`;

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
