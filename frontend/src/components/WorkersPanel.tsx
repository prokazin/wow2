import React from 'react';
import { useGameStore } from '../store/gameStore';

const WorkersPanel: React.FC = () => {
  const { 
    miners, 
    haulers, 
    lumberjacks,
    hunters,
    crystalMiners,
    gold,
    hireWorker, 
    upgradeWorker,
    getWorkerCost,
    getUpgradeCost
  } = useGameStore();

  const workerTypes = [
    { type: 'miner' as const, label: '⛏️ Шахтер', desc: 'Добывает руду' },
    { type: 'hauler' as const, label: '🚶 Носильщик', desc: 'Переносит ресурсы' },
    { type: 'lumberjack' as const, label: '🪓 Лесоруб', desc: 'Добывает древесину' },
    { type: 'hunter' as const, label: '🏹 Охотник', desc: 'Добывает кожу' },
    { type: 'crystal_miner' as const, label: '💠 Кристалломан', desc: 'Добывает кристаллы' }
  ];

  const getWorkers = (type: string) => {
    switch(type) {
      case 'miner': return miners;
      case 'hauler': return haulers;
      case 'lumberjack': return lumberjacks;
      case 'hunter': return hunters;
      case 'crystal_miner': return crystalMiners;
      default: return [];
    }
  };

  return (
    <div className="workers-panel">
      {workerTypes.map(({ type, label, desc }) => {
        const workers = getWorkers(type);
        const totalSpeed = workers.reduce((sum, w) => sum + w.speed, 0);
        const cost = getWorkerCost(type);

        return (
          <div key={type} className="worker-type">
            <div className="worker-type-header">
              <div>
                <div className="worker-type-label">{label}</div>
                <div className="worker-type-desc">{desc}</div>
              </div>
              <button 
                className="btn btn-hire"
                onClick={() => hireWorker(type)}
                disabled={gold < cost}
              >
                Нанять ({cost} золота)
              </button>
            </div>
            <div className="worker-type-stats">
              {workers.length > 0 ? (
                <>
                  <div>Работников: {workers.length}</div>
                  <div>Скорость: {totalSpeed.toFixed(1)}/сек</div>
                  {workers.map(worker => (
                    <div key={worker.id} className="worker-item">
                      <span>Ур. {worker.level} (скорость: {worker.speed.toFixed(1)})</span>
                      <button
                        className="btn btn-upgrade"
                        onClick={() => upgradeWorker(worker.id, type)}
                        disabled={gold < getUpgradeCost(worker)}
                      >
                        ↑ ({getUpgradeCost(worker)} золота)
                      </button>
                    </div>
                  ))}
                </>
              ) : (
                <div className="no-workers">Нет работников</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WorkersPanel;
