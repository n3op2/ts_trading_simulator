import express from 'express';
import * as http from 'http';
import DB from './lib/db';
import Pair from './models/Pair';

const db = new DB('mongodb://127.0.0.1/trader').connect();
const app = express();
const EU = new Pair('EURUSD', 1000);

EU.init();

console.log(EU);

/*
const gatherData = (t: number) => {
  setInterval(async () => {
    const s: number = new Date().getTime();
    await EU.test(res => {
      console.log(`interval [${t}]`, res)
    });
    const e: number = new Date().getTime();
    console.log(s - e);
  }, t);
};
gatherData(30000);
gatherData(10000);
*/

app.get('/', (req, res) => {
  console.log('app.get(/)');
  res.end();
});

const server = http.createServer(app);

server.listen(3006, () => {
  console.log('Server has started...');
});



