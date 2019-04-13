import mongoose from 'mongoose';
import PairSchema from '../schemas/Pair';
import Req from '../lib/request';
import uuidv1 from 'uuid';

const pair = mongoose.model('pairs', PairSchema); 
const url: string = 'https://www.freeforexapi.com/api/live';
// const url: string = 'https://api.exchangeratesapi.io/latest';

type _resData = {
  status: number;
  resTime: string;
  name: string;
  data: any;
};

type _pairData = {
    rate: number;
    name: string;
    timestamp: number;
};

export interface IPair {
  uuid: string;
};

export default class Pair implements IPair {
  private getUrl: string;
  private name: string;
  private req: Req;
  private interval: number;
  uuid = uuidv1();

  constructor(name: string, interval: number) {
    this.name = name;
    this.interval = interval;
    this.getUrl = `${url}?pairs=${name}`;
    this.req = new Req(this.getUrl);
  };

  public init = () => {
    const waiter = setInterval(async () => {
      const res = await this.req.get().then(res => JSON.parse(res));
      console.log(res);
      if (res) {
        put(res);
      }
    }, this.interval);

    const put = (res: _resData) => {
      clearInterval(waiter);
      const pair: _pairData = {
        rate: res.data.rates[this.name].rate,
        name: res.name,
        timestamp: new Date().getTime()
      };
      this.create(pair, (res: boolean) => {
        console.log(res);
      });
    };
  };

  private create = async (data: _pairData, cb: (res: boolean) => void) => {
    const _pair = new pair({
      uuid: this.uuid, 
      rate: data.rate,
      pair_name: data.name,
      date_created: data.timestamp
    });
    await _pair.save((saveErr, saveRes) => {
      if (saveErr) {
        console.log('Error: ', saveErr);
        return cb(false);
      }
      console.log('Info: ', saveRes);
      cb(true);
    });
  };
};

