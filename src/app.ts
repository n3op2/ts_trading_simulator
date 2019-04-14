import DB from './lib/db';
import Pair from './models/Pair';

new DB('mongodb://127.0.0.1/trader').connect();
// TODO get from config
const EURUSD = 'EURUSD';
const EU = new Pair(EURUSD, 1000);

const br = '-> -> -> \n';

// TODO Types!
(async function() {
  const last = await EU.get().then((res: string) => {
    const data: object = JSON.parse(res); 
    console.log(`db.get[INFO] ${br}`, res.slice(0, 20), '\n');
    return data;
  });

  const watch = async (startRate: any) => {

    const rate = await EU.watch().then((res: string) => {
      const r = JSON.parse(res); 
      console.log(`db.watch[INFO] ${br}`, r, '\n');

      if (r.status === 200) {
        const name = Object.keys(r.data.rates)[0];
        const pair = { ...{ name }, ...r.data.rates[name] };
        const { data, timestamp, ...rest } = r;  
        const Response = { ...rest, pair };
        return Response;
      } else {
        console.log(`db.watch[ERROR] ${br}`, data, '\n');

        return 0;
      }
    }).catch((err: string) => {
      const data = JSON.parse(err);
      console.log(`db.watch[ERROR] ${br}`, data);

      return 0;
    });

    // call recursive function
    if (rate.pair.rate === startRate.pair.rate) {
      console.log('===');
      await watch(rate);
    } else {
      console.log('!==');
      await watch(rate);
      /* TODO Save to db
      EU.create(data: {}, (res => {
        await check(last);
      });
      */
    }
    return 'done';
  };

  await watch(last);
  console.log('a')
  console.log('b');
}());



