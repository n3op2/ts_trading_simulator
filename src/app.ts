import DB from './lib/db';
import Pair from './models/Pair';

new DB('mongodb://127.0.0.1/trader').connect();
const EU = new Pair('EURUSD', 1000);

(function() {
  EU.init();
  console.log(EU);
}());



