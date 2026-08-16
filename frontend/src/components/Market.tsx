import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';

const Market: React.FC = () => {
  const { marketPrices, resources, sellResource, gold } = useGameStore();
  const [sellAmount, setSellAmount] = useState<Record<string, number>>({});

  const resourceNames: Record<string, string> = {
    copper: 'Медная руда',
    iron: 'Железная руда',
    silver: 'Серебряная руда',
    gold: 'Золотая руда',
    mithril: 'Мифриловая руда',
    wood: 'Древесина',
    leather: 'Кожа',
    crystals: 'Кристаллы'
  };

  const resourceEmojis: Record<string, string> = {
    copper: '🪨',
    iron: '⚒️',
    silver: '💎',
    gold: '🔥',
    mithril: '⭐',
    wood: '🌳',
    leather: '🧵',
    crystals: '💠'
  };

  const handleSell = (resource: string) => {
    const amount = sellAmount[resource] || 1;
    if (amount > 0) {
      sellResource(resource as any, amount);
      setSellAmount({ ...sellAmount, [resource]: 0 });
    }
  };

  return (
    <div className="market">
      <div className="market-header">
        <h3>🏪 Рынок</h3>
        <div className="market-timer">
          Цены обновляются каждые 2 часа
        </div>
      </div>

      <div className="market-grid">
        {marketPrices.map(price => {
          const resourceKey = price.resource;
          const amount = resources[resourceKey as keyof typeof resources] || 0;
          const emoji = resourceEmojis[resourceKey] || '📦';
          const name = resourceNames[resourceKey] || resourceKey;

          return (
            <div key={price.resource} className="market-item">
              <div className="market-item-header">
                <span className="market-item-name">
                  {emoji} {name}
                </span>
                <span className={`market-item-change ${price.change >= 0 ? 'positive' : 'negative'}`}>
                  {price.change >= 0 ? '↑' : '↓'} {Math.abs(price.change)}%
                </span>
              </div>
              <div className="market-item-price">
                Цена: {price.currentPrice} золота
              </div>
              <div className="market-item-amount">
                У вас: {Math.floor(amount)}
              </div>
              <div className="market-item-controls">
                <input
                  type="number"
                  min="1"
                  max={Math.floor(amount)}
                  value={sellAmount[resourceKey] || 1}
                  onChange={(e) => setSellAmount({
                    ...sellAmount,
                    [resourceKey]: Math.max(1, parseInt(e.target.value) || 1)
                  })}
                  className="market-input"
                />
                <button 
                  className="btn btn-sell"
                  onClick={() => handleSell(resourceKey)}
                  disabled={amount < 1}
                >
                  Продать
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Market;
