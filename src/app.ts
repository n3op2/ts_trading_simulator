import express from 'express';
import * as http from 'http';
import DB from './lib/db';
import Pair from './models/Pair';

const db = new DB('mongodb://127.0.0.1/trader').connect();
const app = express();
const EU = new Pair('EURUSD');

console.log(EU);

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

gatherData(3000);
gatherData(1000);



EU.test(res => {
  const data = JSON.parse(res);
  console.log(data.rates.EURUSD);
});

app.get('/', (req, res) => {
  console.log('app.get(/)');
  res.end();
});

const server = http.createServer(app);

server.listen(3006, () => {
  console.log('Server has started...');
});



