import m_pair from '../models/Pair';
import Req from '../lib/request';
import uuidv1 from 'uuid';

const url: string = 'https://www.freeforexapi.com/api/live';
// const url: string = 'https://api.exchangeratesapi.io/latest';

type _pairData = {
  uuid: string;
  name: string;
  rate: number;
  timestamp: number;
  time: number; 
};

/*
type _resData = {
  uuid: string;
  status: number;
  time: number;
  timestamp: number;
  rates: any;
};
*/

export interface Irates {
  name: string;
  rate: number;
  timestamp: number;
  time: number; 
}
export interface Ipair {
  uuid: string;
  status: number;
  pair: Irates; 
}

export interface IPair {
  uuid: string;
}

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

  private now = () => new Date().getTime();

  // TODO pair type.. nested badly
  private stringToPair = (s: string): Ipair => {
    const pair = JSON.parse(s);
    const name: string = Object.keys(pair.data.rates)[0];
    const time: number = pair.time;
    return ({ uuid: this.uuid, name, ...pair.data.rates[name], time }); 
  };

  public get = (name: string) => new Promise<string>((resolve, reject) => {
    m_pair.findOne().sort('-date_created').lean().exec((err, pair) => {
      if (err) return resolve(JSON.stringify(err));
      console.log('foud one -> ', pair);
      const rates = pair[name];
      const {_id, ...filtered} = pair;
      resolve(JSON.stringify(filtered));
    });
  });

  private getRate = async () => {
    return await this.req.get().then((r: string) => {
      const pair: Ipair = this.stringToPair(r);
      console.log('pair: ', pair);
      return pair;
    }).catch((e: string) => {
      return e;
    });
  };

  public init = async () => {
    const last = await this.get(this.name).then((r: string) => JSON.parse(r));
    const run = async () => {
      const newRate = await this.getRate(); 
      //    const name: string = Object.keys.

      if (!last) {
        console.log(':(');
      }

      console.log('init(): ', newRate);
    };
    return run();
  };

  public watch = () => new Promise<string>((resolve, reject) => {
    this.req.get().then(res => resolve(res)).catch(err => reject(err));
  });

  public save = (data: _pairData, lastPair: _pairData) => new Promise<boolean>(resolve => {
    // TODO type
    console.log(`saving...[${data.name}]`);
    // check if pair exists
    this.get(this.name).then((r: string) => {
      // TODO error and etc... 
      const uuid: string = JSON.parse(r).uuid;
      const pair = new m_pair({
        uuid: uuid ? uuid : this.uuid,
        pair: data,
        date_updated: lastPair.timestamp,
        date_created: this.now()
      });

      pair.save((saveErr, saveRes) => {
        // TODO logger...
        if (saveErr) return resolve(false);
        console.log(`[${data.name}]...saved`);
        resolve(true);
      });
    }); 
  });
};

