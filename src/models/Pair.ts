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

  public get = () => new Promise<string>((resolve, reject) => {
    pair.findOne().sort('-timestamp').lean().exec((err, pair) => {
      if (err) return resolve(JSON.stringify(err));
      const {_id, ...filtered} = pair;
      resolve(JSON.stringify(filtered));
    });
  });

  public watch = () => new Promise<string>((resolve, reject) => {
    this.req.get().then(res => resolve(res)).catch(err => reject(err));
  });

  /* TODO below
  private create = (data: _pairData, cb: (res: boolean) => void) => {
    const newPair = new pair({
      uuid: this.uuid, 
      rate: data.rate,
      pair_name: data.name,
      date_created: data.timestamp
    });

    newPair.save((saveErr, saveRes) => {
      if (saveErr) {
        console.log('Error: ', saveErr);
        return cb(false);
      }
      console.log('Info: ', saveRes);
      cb(true);
    });
  };
  */
};

