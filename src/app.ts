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
}

type _pair = {
  name: string,
  rate: number,
  timestamp: number 
}

type _rate = { uuid: string, res: _res, pair: _pair, timestamp: number };

const getNow = async (): Promise<number> => new Promise(resolve => {
  resolve(new Date().getTime());
});

(async function() {

  // TODO remove
  var oldRate: _rate;
  const last = await EU.get().then((res: string) => {
    const data = JSON.parse(res); 
    console.log(`db.get[INFO] ${br}`, data, '\n');
    return data;
  });

  const watch = async (startRate: any) => {
    

    const now: number = await getNow().then(s => s);
    const rate: any = await EU.watch().then((res: string) => {
      const r = JSON.parse(res); 
      console.log(`watch[INFO] rates ${br}`, r.data.rates, '\n');

      if (r.status === 200) {
        const name: string = Object.keys(r.data.rates)[0];
        const pair: _pair = { name, ...r.data.rates[name] };
        const resObj: _res = {
          status: r.status,
          time: r.time,
          timestamp: now
        };
        const Response: _rate = { 
          uuid: 'asd',
          res: resObj,
          pair: pair,
          timestamp: now
        };

        return Response;
      }
      console.log(`watch[ERROR] ${br}`, rate, '\n');

      return 0;
    }).catch((err: string) => {
      const data = JSON.parse(err);
      console.log(`watch[ERROR] ${br}`, rate, '\n');

      return 0;
    });

    // call recursive function
    if (!rate) {
      console.log(`${startRate.pair.name} -> dead...`);
      return 0;
    }
    if (rate.pair.rate === startRate.pair.rate) {
      console.log('waiting for change...');
      await watch(rate);
    } else {
      const newRate: _rate = rate;
      /* TODO Save to db
      EU.create(data: {}, (res => {
        await check(last);
      });
      */
      console.log('save to db');
      console.log('snoozing...')
      await new Promise<number>(resolve => setTimeout(resolve, 2000));
      await watch(newRate);
      console.log('starting...')
    }
    return 'done';
  };

  // run...
  await watch(last);
}());



