import DB from './lib/db';
import Pair from './models/Pair';

new DB('mongodb://127.0.0.1/trader').connect();
// TODO get from config
const EURUSD = 'EURUSD';
const EU = new Pair(EURUSD, 1000);

const br = '-> -> -> \n';

(async function() {
await EU.watch({ rate: 1.12345 }).then((res: string) => {
    const fullRes = JSON.parse(res); 
    const pair = fullRes.data.rates;
    const name = Object.keys(pair)[0];
    const data = { ...{ name }, ...pair[name] };
    console.log('data: ', data);
    console.log(`db.watch[API] ${br}`, fullRes);
  });
  await EU.get().then((res: string) => {
    const data: object = JSON.parse(res); 
    console.log(`db.get[NEWEST] ${br}`, data);
  });
}());



