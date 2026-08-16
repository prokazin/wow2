import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';

const Crafting: React.FC = () => {
  const { resources, items, craftItem } = useGameStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const recipes = [
    { id: 'copper_ingot', name: 'Медный слиток', type: 'ingot', rarity: 'common', emoji: '🟠' },
    { id: 'iron_ingot', name: 'Железный слиток', type: 'ingot', rarity: 'uncommon', emoji: '⚪' },
    { id: 'silver_ingot', name: 'Серебряный слиток', type: 'ingot', rarity: 'rare', emoji: '🔘' },
    { id: 'gold_ingot', name: 'Золотой слиток', type: 'ingot', rarity: 'epic', emoji: '🟡' },
    { id: 'mithril_ingot', name: 'Мифриловый слиток', type: 'ingot', rarity: 'legendary', emoji: '🔵' },
    { id: 'copper_sword', name: 'Медный меч', type: 'weapon', rarity: 'common', emoji: '🗡️' },
    { id: 'iron_sword', name: 'Железный меч', type: 'weapon', rarity: 'uncommon', emoji: '⚔️' },
    { id: 'silver_sword', name: 'Серебряный меч', type: 'weapon', rarity: 'rare', emoji: '⚔️' },
    { id: 'gold_sword', name: 'Золотой меч', type: 'weapon', rarity: 'epic', emoji: '⚔️' },
    { id: 'mithril_sword', name: 'Мифриловый меч', type: 'weapon', rarity: 'legendary', emoji: '⚔️' },
    { id: 'copper_helmet', name: 'Медный шлем', type: 'helmet', rarity: 'common', emoji: '⛑️' },
    { id: 'iron_helmet', name: 'Железный шлем', type: 'helmet', rarity: 'uncommon', emoji: '⛑️' },
    { id: 'silver_helmet', name: 'Серебряный шлем', type: 'helmet', rarity: 'rare', emoji: '⛑️' },
    { id: 'gold_helmet', name: 'Золотой шлем', type: 'helmet', rarity: 'epic', emoji: '⛑️' },
    { id: 'mithril_helmet', name: 'Мифриловый шлем', type: 'helmet', rarity: 'legendary', emoji: '⛑️' },
    { id: 'copper_armor', name: 'Медная броня', type: 'armor', rarity: 'common', emoji: '🛡️' },
    { id: 'iron_armor', name: 'Железная броня', type: 'armor', rarity: 'uncommon', emoji: '🛡️' },
    { id: 'silver_armor', name: 'Серебряная броня', type: 'armor', rarity: 'rare', emoji: '🛡️' },
    { id: 'gold_armor', name: 'Золотая броня', type: 'armor', rarity: 'epic', emoji: '🛡️' },
    { id: 'mithril_armor', name: 'Мифриловая броня', type: 'armor', rarity: 'legendary', emoji: '🛡️' },
    { id: 'copper_ring', name: 'Медное кольцо', type: 'accessory', rarity: 'common', emoji: '💍' },
    { id: 'iron_ring', name: 'Железное кольцо', type: 'accessory', rarity: 'uncommon', emoji: '💍' },
    { id: 'silver_ring', name: 'Серебряное кольцо', type: 'accessory', rarity: 'rare', emoji: '💍' },
    { id: 'gold_ring', name: 'Золотое кольцо', type: 'accessory', rarity: 'epic', emoji: '💍' },
    { id: 'mithril_ring', name: 'Мифриловое кольцо', type: 'accessory', rarity: 'legendary', emoji: '💍' }
  ];

  const categories = ['all', 'ingot', 'weapon', 'helmet', 'armor', 'accessory'];
  const categoryNames: Record<string, string> = {
    all: 'Все',
    ingot: 'Слитки',
    weapon: 'Оружие',
    helmet: 'Шлемы',
    armor: 'Броня',
    accessory: 'Аксессуары'
  };

  const filteredRecipes = selectedCategory === 'all' 
    ? recipes 
    : recipes.filter(r => r.type === selectedCategory);

  const canCraft = (recipeId: string) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return false;
    
    const item = items.find(i => i.id === recipeId);
    const requirements = item?.requires || {};

    for (const [key, amount] of Object.entries(requirements)) {
      if ((resources as any)[key] < amount) return false;
    }
    return true;
  };

  const getRequirements = (recipeId: string) => {
    const item = items.find(i => i.id === recipeId);
    if (!item) return '';
    
    const reqs = item.requires;
    const parts = [];
    for (const [key, amount] of Object.entries(reqs)) {
      const names: Record<string, string> = {
        copper: 'Медь',
        iron: 'Железо',
        silver: 'Серебро',
        gold: 'Золото',
        mithril: 'Мифрил',
        wood: 'Древесина',
        leather: 'Кожа',
        crystals: 'Кристаллы'
      };
      parts.push(`${amount} ${names[key] || key}`);
    }
    return parts.join(', ');
  };

  return (
    <div className="crafting">
      <div className="crafting-header">
        <h3>⚒️ Кузница</h3>
        <div className="crafting-tabs">
          {categories.map(cat => (
            <button
              key={cat}
              className={`craft-tab ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {categoryNames[cat]}
            </button>
          ))}
        </div>
      </div>

      <div className="crafting-grid">
        {filteredRecipes.map(recipe => {
          const item = items.find(i => i.id === recipe.id);
          const count = item?.count || 0;
          const can = canCraft(recipe.id);
          const reqs = getRequirements(recipe.id);

          return (
            <div key={recipe.id} className={`craft-item rarity-${recipe.rarity}`}>
              <div className="craft-item-header">
                <span className="craft-item-emoji">{recipe.emoji}</span>
                <span className="craft-item-name">{recipe.name}</span>
                <span className="craft-item-count">×{count}</span>
              </div>
              <div className="craft-item-requirements">
                Требуется: {reqs}
              </div>
              <button
                className={`btn btn-craft ${can ? '' : 'disabled'}`}
                onClick={() => craftItem(recipe.id)}
                disabled={!can}
              >
                {can ? 'Создать' : 'Не хватает ресурсов'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Crafting;
