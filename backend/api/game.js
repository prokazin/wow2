import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const gameData = {};

app.get('/api/game', (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: 'userId required' });
  }
  
  const data = gameData[userId] || {
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
    lastMarketUpdate: Date.now()
  };
  
  res.json(data);
});

app.post('/api/game', (req, res) => {
  const { userId, resources, items, miners, haulers, lumberjacks, hunters, crystalMiners, gold, marketPrices, lastMarketUpdate } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'userId required' });
  }
  
  gameData[userId] = { 
    resources, 
    items, 
    miners, 
    haulers, 
    lumberjacks, 
    hunters, 
    crystalMiners, 
    gold, 
    marketPrices, 
    lastMarketUpdate 
  };
  res.json({ success: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
