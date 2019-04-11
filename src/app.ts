import express from 'express';
import * as http from 'http';
import DB from './lib/db';
import { Pair } from './models/Pair';

console.log(Pair.create());

const db = new DB('mongodb://127.0.0.1/trader').connect();
const app = express();

app.get('/', (req, res) => {
  console.log('app.get(/)');
  res.end();
});

const server = http.createServer(app);

server.listen(3006, () => {
  console.log('Server has started...');
});



