import DB from './lib/db';
import Pair from './models/Pair';

new DB('mongodb://127.0.0.1/trader').connect();
// TODO get from config
const EURUSD = 'EURUSD';
const EU = new Pair(EURUSD, 1000);

const br = '-> -> -> \n';

// TODO Types!
type _res = {
  status: number,
  time: string,
  timestamp: number, 
};


type _pair = {
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

  // TODO remove
  var oldRate: _rate;

  // TODO Controllers
  const getLast = () => EU.get().then(r => JSON.parse(r));
 
  const last = await EU.get().then((res: string) => {
    const data = JSON.parse(res); 
    console.log(`db.get[INFO] ${br}`, data, '\n');
    return data;
  });


  // recursive
  const watch = async (oldPair: any) => {
    const now: number = await getNow().then(s => s);
    const newPair: any = await EU.watch().then((res: string) => {
      const r = JSON.parse(res); 

      if (r.status === 200) {
        const name: string = Object.keys(r.data.rates)[0];
        const time = r.time;
        const pair: _pair = { name, ...r.data.rates[name], time };
        console.log(r.time);
        return pair; 
      }

      console.log(`watch[ERROR] ${br}`, newPair, '\n');

      return 0;
    }).catch((err: string) => {
      const data = JSON.parse(err);
      console.log(`watch[ERROR] ${br}`, newPair, '\n');

      return 0;
    });

    // call recursive function
    if (!newPair) {
      console.log(`${newPair.name} -> dead...`);
      return 0;
    }

    console.log('old rate: ', newPair.rate);
    console.log('new rate: ', oldPair.rate);
    
    
    if (newPair.rate === oldPair.rate) {
      console.log('waiting for change...');
      await watch(newPair);
    } else {
      await EU.save(newPair, oldPair);
      console.log('snoozing...')
      await new Promise<number>(resolve => setTimeout(resolve, 2000));
      await watch(newPair);
    }
    return 'done';
  };

  // run...
  await watch(last.pair);
}());



