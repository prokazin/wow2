import React, { useEffect } from 'react';
import Game from './components/Game';
import { useGameStore } from './store/gameStore';

const App: React.FC = () => {
  const { loadGame } = useGameStore();

  useEffect(() => {
    loadGame();
    
    const interval = setInterval(() => {
      useGameStore.getState().saveGame();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      <Game />
    </div>
  );
};

export default App;
