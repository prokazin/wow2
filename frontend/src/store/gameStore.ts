import { create } from 'zustand';
import axios from 'axios';

export interface Worker {
  id: string;
  type: 'miner' | 'hauler' | 'lumberjack' | 'hunter' | 'crystal_miner';
  level: number;
  speed: number;
  count: number;
}

export interface Resources {
  copper: number;
  iron: number;
  silver: number;
  gold: number;
  mithril: number;
  wood: number;
  leather: number;
  crystals: number;
}

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'helmet' | 'armor' | 'ingot' | 'accessory';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  requires: {
    copper?: number;
    iron?: number;
    silver?: number;
    gold?: number;
    mithril?: number;
    wood?: number;
    leather?: number;
    crystals?: number;
  };
  count: number;
  sellPrice: number;
}

export interface MarketPrice {
  resource: string;
  basePrice: number;
  currentPrice: number;
  change: number;
}

interface GameState {
  userId: string;
  resources: Resources;
  items: Item[];
  miners: Worker[];
  haulers: Worker[];
  lumberjacks: Worker[];
  hunters: Worker[];
  crystalMiners: Worker[];
  marketPrices: MarketPrice[];
  gold: number;
  maxStorage: number;
  lastMarketUpdate: number;
  
  loadGame: () => void;
  saveGame: () => void;
  tick: () => void;
  hireWorker: (type: 'miner' | 'hauler' | 'lumberjack' | 'hunter' | 'crystal_miner') => void;
  upgradeWorker: (id: string, type: 'miner' | 'hauler' | 'lumberjack' | 'hunter' | 'crystal_miner') => void;
  craftItem: (itemId: string) => void;
  sellResource: (resource: keyof Resources, amount: number) => void;
  updateMarket: () => void;
  getWorkerCost: (type: string) => number;
  getUpgradeCost: (worker: Worker) => number;
}

const BASE_WORKER_COSTS = {
  miner: 50,
  hauler: 30,
  lumberjack: 40,
  hunter: 45,
  crystal_miner: 80
};

const CRAFT_RECIPES: Record<string, Omit<Item, 'count' | 'sellPrice'>> = {
  'copper_ingot': {
    id: 'copper_ingot',
    name: 'Медный слиток',
    type: 'ingot',
    rarity: 'common',
    requires: { copper: 5 }
  },
  'iron_ingot': {
    id: 'iron_ingot',
    name: 'Железный слиток',
    type: 'ingot',
    rarity: 'uncommon',
    requires: { iron: 5 }
  },
  'silver_ingot': {
    id: 'silver_ingot',
    name: 'Серебряный слиток',
    type: 'ingot',
    rarity: 'rare',
    requires: { silver: 5 }
  },
  'gold_ingot': {
    id: 'gold_ingot',
    name: 'Золотой слиток',
    type: 'ingot',
    rarity: 'epic',
    requires: { gold: 5 }
  },
  'mithril_ingot': {
    id: 'mithril_ingot',
    name: 'Мифриловый слиток',
    type: 'ingot',
    rarity: 'legendary',
    requires: { mithril: 5 }
  },
  'copper_sword': {
    id: 'copper_sword',
    name: 'Медный меч',
    type: 'weapon',
    rarity: 'common',
    requires: { copper: 3, wood: 1 }
  },
  'iron_sword': {
    id: 'iron_sword',
    name: 'Железный меч',
    type: 'weapon',
    rarity: 'uncommon',
    requires: { iron: 3, wood: 2 }
  },
  'silver_sword': {
    id: 'silver_sword',
    name: 'Серебряный меч',
    type: 'weapon',
    rarity: 'rare',
    requires: { silver: 3, wood: 3 }
  },
  'gold_sword': {
    id: 'gold_sword',
    name: 'Золотой меч',
    type: 'weapon',
    rarity: 'epic',
    requires: { gold: 3, wood: 5 }
  },
  'mithril_sword': {
    id: 'mithril_sword',
    name: 'Мифриловый меч',
    type: 'weapon',
    rarity: 'legendary',
    requires: { mithril: 3, wood: 8, crystals: 2 }
  },
  'copper_helmet': {
    id: 'copper_helmet',
    name: 'Медный шлем',
    type: 'helmet',
    rarity: 'common',
    requires: { copper: 4, leather: 2 }
  },
  'iron_helmet': {
    id: 'iron_helmet',
    name: 'Железный шлем',
    type: 'helmet',
    rarity: 'uncommon',
    requires: { iron: 4, leather: 3 }
  },
  'silver_helmet': {
    id: 'silver_helmet',
    name: 'Серебряный шлем',
    type: 'helmet',
    rarity: 'rare',
    requires: { silver: 4, leather: 5 }
  },
  'gold_helmet': {
    id: 'gold_helmet',
    name: 'Золотой шлем',
    type: 'helmet',
    rarity: 'epic',
    requires: { gold: 4, leather: 8, crystals: 3 }
  },
  'mithril_helmet': {
    id: 'mithril_helmet',
    name: 'Мифриловый шлем',
    type: 'helmet',
    rarity: 'legendary',
    requires: { mithril: 4, leather: 12, crystals: 5 }
  },
  'copper_armor': {
    id: 'copper_armor',
    name: 'Медная броня',
    type: 'armor',
    rarity: 'common',
    requires: { copper: 6, leather: 3, wood: 1 }
  },
  'iron_armor': {
    id: 'iron_armor',
    name: 'Железная броня',
    type: 'armor',
    rarity: 'uncommon',
    requires: { iron: 6, leather: 5, wood: 2 }
  },
  'silver_armor': {
    id: 'silver_armor',
    name: 'Серебряная броня',
    type: 'armor',
    rarity: 'rare',
    requires: { silver: 6, leather: 8, wood: 4 }
  },
  'gold_armor': {
    id: 'gold_armor',
    name: 'Золотая броня',
    type: 'armor',
    rarity: 'epic',
    requires: { gold: 6, leather: 12, wood: 6, crystals: 4 }
  },
  'mithril_armor': {
    id: 'mithril_armor',
    name: 'Мифриловая броня',
    type: 'armor',
    rarity: 'legendary',
    requires: { mithril: 6, leather: 20, wood: 10, crystals: 8 }
  },
  'copper_ring': {
    id: 'copper_ring',
    name: 'Медное кольцо',
    type: 'accessory',
    rarity: 'common',
    requires: { copper: 2, crystals: 1 }
  },
  'iron_ring': {
    id: 'iron_ring',
    name: 'Железное кольцо',
    type: 'accessory',
    rarity: 'uncommon',
    requires: { iron: 2, crystals: 2 }
  },
  'silver_ring': {
    id: 'silver_ring',
    name: 'Серебряное кольцо',
    type: 'accessory',
    rarity: 'rare',
    requires: { silver: 2, crystals: 3 }
  },
  'gold_ring': {
    id: 'gold_ring',
    name: 'Золотое кольцо',
    type: 'accessory',
    rarity: 'epic',
    requires: { gold: 2, crystals: 5 }
  },
  'mithril_ring': {
    id: 'mithril_ring',
    name: 'Мифриловое кольцо',
    type: 'accessory',
    rarity: 'legendary',
    requires: { mithril: 2, crystals: 8 }
  }
};

export const useGameStore = create<GameState>((set, get) => ({
  userId: 'test_user',
  resources: {
    copper: 100,
    iron: 50,
    silver: 20,
    gold: 10,
    mithril: 5,
    wood: 30,
    leather: 20,
    crystals: 5
  },
  items: [],
  miners: [{ id: 'm1', type: 'miner', level: 1, speed: 1, count: 1 }],
  haulers: [{ id: 'h1', type: 'hauler', level: 1, speed: 1, count: 1 }],
  lumberjacks: [],
  hunters: [],
  crystalMiners: [],
  gold: 0,
  maxStorage: 1000,
  lastMarketUpdate: Date.now(),
  marketPrices: [
    { resource: 'copper', basePrice: 2, currentPrice: 2, change: 0 },
    { resource: 'iron', basePrice: 4, currentPrice: 4, change: 0 },
    { resource: 'silver', basePrice: 8, currentPrice: 8, change: 0 },
    { resource: 'gold', basePrice: 15, currentPrice: 15, change: 0 },
    { resource: 'mithril', basePrice: 30, currentPrice: 30, change: 0 },
    { resource: 'wood', basePrice: 3, currentPrice: 3, change: 0 },
    { resource: 'leather', basePrice: 5, currentPrice: 5, change: 0 },
    { resource: 'crystals', basePrice: 20, currentPrice: 20, change: 0 }
  ],

  loadGame: async () => {
    try {
      const response = await axios.get('/api/game', {
        params: { userId: 'test_user' }
      });
      if (response.data) {
        set({
          resources: response.data.resources || get().resources,
          items: response.data.items || [],
          miners: response.data.miners || get().miners,
          haulers: response.data.haulers || get().haulers,
          lumberjacks: response.data.lumberjacks || [],
          hunters: response.data.hunters || [],
          crystalMiners: response.data.crystalMiners || [],
          gold: response.data.gold || 0,
          marketPrices: response.data.marketPrices || get().marketPrices,
          lastMarketUpdate: response.data.lastMarketUpdate || Date.now()
        });
      }
    } catch (error) {
      console.log('Загружена локальная игра');
    }
    get().updateMarket();
    get().tick();
  },

  saveGame: async () => {
    const state = get();
    try {
      await axios.post('/api/game', {
        userId: state.userId,
        resources: state.resources,
        items: state.items,
        miners: state.miners,
        haulers: state.haulers,
        lumberjacks: state.lumberjacks,
        hunters: state.hunters,
        crystalMiners: state.crystalMiners,
        gold: state.gold,
        marketPrices: state.marketPrices,
        lastMarketUpdate: state.lastMarketUpdate
      });
    } catch (error) {
      console.error('Ошибка сохранения');
    }
  },

  getWorkerCost: (type: string) => {
    const state = get();
    const base = BASE_WORKER_COSTS[type as keyof typeof BASE_WORKER_COSTS] || 50;
    let count = 0;
    switch(type) {
      case 'miner': count = state.miners.length; break;
      case 'hauler': count = state.haulers.length; break;
      case 'lumberjack': count = state.lumberjacks.length; break;
      case 'hunter': count = state.hunters.length; break;
      case 'crystal_miner': count = state.crystalMiners.length; break;
    }
    return base * (count + 1);
  },

  getUpgradeCost: (worker: Worker) => {
    return 20 * worker.level;
  },

  hireWorker: (type: 'miner' | 'hauler' | 'lumberjack' | 'hunter' | 'crystal_miner') => {
    const state = get();
    const cost = state.getWorkerCost(type);
    if (state.gold < cost) return;

    const newWorker: Worker = {
      id: `${type}_${Date.now()}`,
      type,
      level: 1,
      speed: type === 'hauler' ? 1 : 1,
      count: 1
    };

    const update: any = { gold: state.gold - cost };
    switch(type) {
      case 'miner': update.miners = [...state.miners, newWorker]; break;
      case 'hauler': update.haulers = [...state.haulers, newWorker]; break;
      case 'lumberjack': update.lumberjacks = [...state.lumberjacks, newWorker]; break;
      case 'hunter': update.hunters = [...state.hunters, newWorker]; break;
      case 'crystal_miner': update.crystalMiners = [...state.crystalMiners, newWorker]; break;
    }
    set(update);
  },

  upgradeWorker: (id: string, type: 'miner' | 'hauler' | 'lumberjack' | 'hunter' | 'crystal_miner') => {
    const state = get();
    let workers: Worker[] = [];
    switch(type) {
      case 'miner': workers = state.miners; break;
      case 'hauler': workers = state.haulers; break;
      case 'lumberjack': workers = state.lumberjacks; break;
      case 'hunter': workers = state.hunters; break;
      case 'crystal_miner': workers = state.crystalMiners; break;
    }
    const worker = workers.find(w => w.id === id);
    if (!worker) return;

    const cost = state.getUpgradeCost(worker);
    if (state.gold < cost) return;

    const updatedWorker = { ...worker, level: worker.level + 1, speed: worker.speed + 0.5 };
    const update: any = { gold: state.gold - cost };
    switch(type) {
      case 'miner': update.miners = state.miners.map(w => w.id === id ? updatedWorker : w); break;
      case 'hauler': update.haulers = state.haulers.map(w => w.id === id ? updatedWorker : w); break;
      case 'lumberjack': update.lumberjacks = state.lumberjacks.map(w => w.id === id ? updatedWorker : w); break;
      case 'hunter': update.hunters = state.hunters.map(w => w.id === id ? updatedWorker : w); break;
      case 'crystal_miner': update.crystalMiners = state.crystalMiners.map(w => w.id === id ? updatedWorker : w); break;
    }
    set(update);
  },

  craftItem: (itemId: string) => {
    const state = get();
    const recipe = CRAFT_RECIPES[itemId];
    if (!recipe) return;

    const resources = { ...state.resources };
    const required = recipe.requires;

    for (const [key, amount] of Object.entries(required)) {
      if ((resources as any)[key] < amount) return;
    }

    for (const [key, amount] of Object.entries(required)) {
      (resources as any)[key] -= amount;
    }

    const newItem: Item = {
      ...recipe,
      count: 1,
      sellPrice: state.marketPrices.find(p => p.resource === itemId)?.currentPrice || 10
    };

    const existingItem = state.items.find(i => i.id === itemId);
    let updatedItems: Item[];
    if (existingItem) {
      updatedItems = state.items.map(i => 
        i.id === itemId ? { ...i, count: i.count + 1 } : i
      );
    } else {
      updatedItems = [...state.items, newItem];
    }

    set({ resources, items: updatedItems });
  },

  sellResource: (resource: keyof Resources, amount: number) => {
    const state = get();
    if (state.resources[resource] < amount) return;

    const price = state.marketPrices.find(p => p.resource === resource)?.currentPrice || 1;
    const goldEarned = amount * price;

    set({
      resources: { ...state.resources, [resource]: state.resources[resource] - amount },
      gold: state.gold + goldEarned
    });
  },

  updateMarket: () => {
    const state = get();
    const now = Date.now();
    const twoHours = 2 * 60 * 60 * 1000;

    if (now - state.lastMarketUpdate < twoHours) return;

    const updatedPrices = state.marketPrices.map(price => {
      const change = (Math.random() - 0.5) * 0.4;
      const newPrice = Math.max(1, price.basePrice * (1 + change));
      return {
        ...price,
        currentPrice: Math.round(newPrice * 100) / 100,
        change: Math.round(change * 100)
      };
    });

    set({
      marketPrices: updatedPrices,
      lastMarketUpdate: now
    });
  },

  tick: () => {
    const state = get();
    const resources = { ...state.resources };

    const miningRate = state.miners.reduce((sum, m) => sum + m.speed, 0);
    const haulingRate = state.haulers.reduce((sum, h) => sum + h.speed, 0);
    const woodRate = state.lumberjacks.reduce((sum, l) => sum + l.speed, 0);
    const leatherRate = state.hunters.reduce((sum, h) => sum + h.speed, 0);
    const crystalRate = state.crystalMiners.reduce((sum, c) => sum + c.speed, 0);

    const totalProduction = miningRate + woodRate + leatherRate + crystalRate;
    const haulCapacity = Math.min(haulingRate, totalProduction);

    const copperShare = miningRate * 0.4;
    const ironShare = miningRate * 0.3;
    const silverShare = miningRate * 0.15;
    const goldShare = miningRate * 0.1;
    const mithrilShare = miningRate * 0.05;

    const storageLeft = state.maxStorage - Object.values(resources).reduce((a, b) => a + b, 0);
    const maxAdd = Math.min(haulCapacity, storageLeft);

    if (maxAdd > 0) {
      const totalMining = miningRate + woodRate + leatherRate + crystalRate;
      if (totalMining > 0) {
        const ratio = maxAdd / totalMining;
        resources.copper += copperShare * ratio;
        resources.iron += ironShare * ratio;
        resources.silver += silverShare * ratio;
        resources.gold += goldShare * ratio;
        resources.mithril += mithrilShare * ratio;
        resources.wood += woodRate * ratio;
        resources.leather += leatherRate * ratio;
        resources.crystals += crystalRate * ratio;
      }
    }

    for (const key of Object.keys(resources) as Array<keyof Resources>) {
      resources[key] = Math.round(resources[key] * 100) / 100;
    }

    set({ resources });
  },
}));

setInterval(() => {
  useGameStore.getState().tick();
}, 1000);

setInterval(() => {
  useGameStore.getState().updateMarket();
}, 2 * 60 * 60 * 1000);
