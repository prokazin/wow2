import React, { useState } from 'react';
import Mine from './Mine';
import WorkersPanel from './WorkersPanel';
import Market from './Market';
import Crafting from './Crafting';
import { useGameStore } from '../store/gameStore';

const Game: React.FC = () => {
  const { resources, gold } = useGameStore();
  const [activeTab, setActiveTab] = useState<'mine' | 'workers' | 'market' | 'craft'>('mine');

  const totalResources = Object.values(resources).reduce((a, b) => a + b, 0);

  return (
    <div className="game-container">
      <div className="resources">
        <div className="resource-item">
          <div className="label">💰 ЗОЛОТО</div>
          <div className="value gold">{Math.floor(gold)}</div>
        </div>
        <div className="resource-item">
          <div className="label">📦 РЕСУРСЫ</div>
          <div className="value">{Math.floor(totalResources)}</div>
        </div>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'mine' ? 'active' : ''}`}
          onClick={() => setActiveTab('mine')}
        >
          ⛏️ Шахта
        </button>
        <button 
          className={`tab ${activeTab === 'workers' ? 'active' : ''}`}
          onClick={() => setActiveTab('workers')}
        >
          👷 Работники
        </button>
        <button 
          className={`tab ${activeTab === 'market' ? 'active' : ''}`}
          onClick={() => setActiveTab('market')}
        >
          🏪 Рынок
        </button>
        <button 
          className={`tab ${activeTab === 'craft' ? 'active' : ''}`}
          onClick={() => setActiveTab('craft')}
        >
          ⚒️ Крафт
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'mine' && <Mine />}
        {activeTab === 'workers' && <WorkersPanel />}
        {activeTab === 'market' && <Market />}
        {activeTab === 'craft' && <Crafting />}
      </div>
    </div>
  );
};

export default Game;
