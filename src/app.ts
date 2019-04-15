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
  resTime: string,
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

  const last = await EU.get().then((res: string) => {
    const data = JSON.parse(res); 
    console.log(`db.get[INFO] ${br}`, data, '\n');
    return data;
  });

  const watch = async (startRate: any) => {
    
    const now: number = await getNow().then(s => s);
    const rate: _rate = await EU.watch().then((res: string) => {
      const r = JSON.parse(res); 
      console.log(`watch[INFO] ${br}`, r, '\n');

      if (r.status === 200) {
        const name: string = Object.keys(r.data.rates)[0];
        const pair: _pair = { name, ...r.data.rates[name] };
        const resObj: _res = {
          status: r.status,
          resTime: r.resTime,
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
      console.log(`watch[ERROR] ${br}`, r, '\n');
      return 0;
    }).catch((err: string) => {
      const data = JSON.parse(err);
      console.log(`watch[ERROR] ${br}`, data);

      return 0;
    });

    // call recursive function
    if (!rate) return 0;
    console.log(' :', Object.keys(rate));
    return 'done';
    /*
    if (rate.pair.rate !== startRate.pair.rate) {
      await watch(rate);
    } else {
      /* TODO Save to db
      EU.create(data: {}, (res => {
        await check(last);
      });
      /
      console.log('save to db');
    }
    */
  };

  await watch(last);
  console.log('a')
  console.log('b');
}());



