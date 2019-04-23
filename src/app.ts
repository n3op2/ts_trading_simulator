import DB from './lib/db';
import Pair from './classes/Pair';
import Line from './classes/Line';
import uuidv1 from 'uuid';

new DB('mongodb://127.0.0.1/trader').connect();
// TODO get from config
const EURUSD = 'EURUSD';

// Test line
const line = {
  uuid: uuidv1(),
  pair_uuid: '0b76d23d-abbf-aaaa-980e-924aa571okaf', 
  line_rate: 1.12245,
  stop_loss: 17, 
  risk: 2.5
} 

const line1Config = {
  pair_uuid: '',  
  stop_loss: 20,
  rate: 1.13000,
  test1: 1.31546,
  test2: 1.3345,
  risk: 3,
  bid: 'buy'
}

const myLine1 = new Line(line1Config);

myLine1.save(line);
const EU = new Pair(EURUSD, 1000);

const br = '-> -> -> \n';

// TODO Types!
type _res = {
  status: number,
  time: string,
  timestamp: number, 
};

type _pair = {
  uuid: string,
  name: string,
  rate: number,
  timestamp: number, 
  time: number
};

type _rate = { 
  uuid: string,
  pair: _pair,
};

const getNow = async (): Promise<number> => new Promise(resolve => {
  resolve(new Date().getTime());
});

// test pair 
const t_pair = {
  uuid: '90ef270f-1710-41ab-ad60-0737aa873306',
  pair: {
    name: 'EURUSD',
    rate: 1.30499,
    time: 3374,
    timestamp: 1555443116131
  },
  date_updated: 1555443016131
};

(async function() {
  // TODO Controllers
  const getLast = () => EU.get(EURUSD).then(r => JSON.parse(r));
  const last = await EU.get(EURUSD).then((res: string) => {
    const data = JSON.parse(res); 
    console.log(`db.get[INFO] ${br}`, data, '\n');
    return data;
  });

  EU.init();
  // recursive
  /*
  const watch = async (oldPair: _pair) => {
    const now: number = await getNow().then(s => s);
    const newPair: _pair = await EU.watch().then((res: string) => {
      const r = JSON.parse(res); 

      if (r.status === 200) {
        const name: string = Object.keys(r.data.rates)[0];
        const time: number = r.time;
        const { uuid } = oldPair;
        const pair: _pair = { uuid, name, ...r.data.rates[name], time };

        return pair; 
      }
      console.log(`watch[ERROR] ${br}`, newPair, '\n');

      return oldPair;
    }).catch((err: string) => {
      const data = JSON.parse(err);
      console.log(`watch[ERROR] ${br}`, oldPair, '\n');

      return oldPair;
    });

    if (!newPair) {
      console.log(`${oldPair.name} -> dead...`);
      return oldPair;
    }

    console.log('old rate: ', newPair.rate);
    
    if (newPair.rate === oldPair.rate) {
      await myLine1.work(newPair, 'eda65c7d-5a25-46f7-9d18-3731922c8813');
      await watch(newPair);
    } else {
      // :)
      // TODO shouldbuy and save to the db 
      /*
      if (shouldBuy) {
        console.log('bought... check time out...');
        await new Promise<number>(resolve => setTimeout(resolve, 2000000));
      }
      /
      await EU.save(newPair, oldPair);
      await new Promise<number>(resolve => setTimeout(resolve, 2000));
      await watch(newPair);
    }
    return 'done';
  };

  // run...
  const pair = last.pair
  const reqPairObject = { uuid: last.uuid, ...pair };
  // await watch(reqPairObject);
  */
}());



