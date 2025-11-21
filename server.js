const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const DATA_FILE = path.join(__dirname, 'data', 'wa_orders.json');
const PORT = process.env.PORT || 4000;
const API_SECRET = process.env.WA_API_SECRET || 'change-me';

function ensureDataFile(){
  const dir = path.dirname(DATA_FILE);
  if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if(!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]');
}

function readAll(){
  ensureDataFile();
  try{ return JSON.parse(fs.readFileSync(DATA_FILE,'utf8')||'[]'); }catch(e){ return []; }
}

function writeAll(data){
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '250kb' }));

// Health
app.get('/', (req,res)=>res.send('Bakso webhook server running'));

// Receive webhook (from WhatsApp provider) - simple interface
app.post('/webhook', (req,res)=>{
  const secret = req.get('x-wa-secret') || req.query.secret;
  if(!secret || secret !== API_SECRET) return res.status(401).json({ error: 'invalid-secret' });

  // expect { id?, text, from, timestamp }
  const { id, text, from, timestamp } = req.body || {};
  if(!text) return res.status(400).json({ error: 'missing text' });

  const orders = readAll();
  const entry = {
    id: id || (Date.now() + '-' + Math.floor(Math.random()*9000+1000)),
    date: new Date(timestamp ? timestamp : Date.now()).toISOString(),
    customer: from || 'WA',
    phone: from || '',
    items: [],
    total: 0,
    status: 'Pengiriman',
    note: text,
    source: 'webhook'
  };
  orders.push(entry);
  writeAll(orders);
  return res.json({ ok: true, id: entry.id });
});

// List orders
app.get('/api/wa-orders', (req,res)=>{
  const orders = readAll();
  res.json(orders);
});

// simple endpoint to clear all (protected)
app.post('/api/wa-orders/clear', (req,res)=>{
  const secret = req.get('x-wa-secret') || req.query.secret;
  if(!secret || secret !== API_SECRET) return res.status(401).json({ error: 'invalid-secret' });
  writeAll([]);
  res.json({ ok: true });
});

app.listen(PORT, ()=> console.log(`WA webhook server listening at http://localhost:${PORT} (secret: ${API_SECRET})`));
