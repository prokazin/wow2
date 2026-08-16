import React from 'react';
import { useGameStore } from '../store/gameStore';

const Mine: React.FC = () => {
  const { resources, miners, lumberjacks, hunters, crystalMiners } = useGameStore();

  const miningRate = miners.reduce((sum, m) => sum + m.speed, 0);
  const woodRate = lumberjacks.reduce((sum, l) => sum + l.speed, 0);
  const leatherRate = hunters.reduce((sum, h) => sum + h.speed, 0);
  const crystalRate = crystalMiners.reduce((sum, c) => sum + c.speed, 0);

  return (
    <div className="mine">
      <div className="building">
        <div className="building-header">
          <div className="building-title">⛏️ Шахта</div>
          <div className="building-stats">
            Добыча: {miningRate.toFixed(1)}/сек
          </div>
        </div>
        <div className="resource-grid">
          <div className="resource-display">
            <span>🪨 Медь: {Math.floor(resources.copper)}</span>
          </div>
          <div className="resource-display">
            <span>⚒️ Железо: {Math.floor(resources.iron)}</span>
          </div>
          <div className="resource-display">
            <span>💎 Серебро: {Math.floor(resources.silver)}</span>
          </div>
          <div className="resource-display">
            <span>🔥 Золото: {Math.floor(resources.gold)}</span>
          </div>
          <div className="resource-display">
            <span>⭐ Мифрил: {Math.floor(resources.mithril)}</span>
          </div>
        </div>
      </div>

      <div className="building">
        <div className="building-header">
          <div className="building-title">🌲 Лесопилка</div>
          <div className="building-stats">
            Добыча: {woodRate.toFixed(1)}/сек
          </div>
        </div>
        <div className="resource-display">
          <span>🌳 Древесина: {Math.floor(resources.wood)}</span>
        </div>
      </div>

      <div className="building">
        <div className="building-header">
          <div className="building-title">🏹 Охотничьи угодья</div>
          <div className="building-stats">
            Добыча: {leatherRate.toFixed(1)}/сек
          </div>
        </div>
        <div className="resource-display">
          <span>🧵 Кожа: {Math.floor(resources.leather)}</span>
        </div>
      </div>

      <div className="building">
        <div className="building-header">
          <div className="building-title">💠 Кристальные пещеры</div>
          <div className="building-stats">
            Добыча: {crystalRate.toFixed(1)}/сек
          </div>
        </div>
        <div className="resource-display">
          <span>💠 Кристаллы: {Math.floor(resources.crystals)}</span>
        </div>
      </div>
    </div>
  );
};

export default Mine;
