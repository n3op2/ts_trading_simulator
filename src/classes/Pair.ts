import m_pair from '../models/Pair';
import Req from '../lib/request';
import uuidv1 from 'uuid';
import Line from './Line';

console.log('---------------> ', new Line());

const url: string = 'https://www.freeforexapi.com/api/live';
// const url: string = 'https://api.exchangeratesapi.io/latest';

type _pairData = {
  uuid?: string;
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

interface Irates {
  name: string;
  rate: number;
  timestamp: number;
  time: number; 
}

interface Ipair {
  name: string;
  rate: number;
  timestamp: number;
  time: number; 
  pair: Irates; 
  // timestamps...
}

interface IPair {
  now(): number;
  stringToPair(s: string): void; 
}

export default class Pair implements IPair{
  private getUrl: string;
  private name: string;
  private req: Req;
  private interval: number;
  private oldPair: _pairData | string;
  private uuid: string | Promise<void>;

  // get timestamp     
  // ======================================================
  now() {
    return new Date().getTime();
  }

  // String to JSON obj
  // ======================================================
  // TODO pair type.. nested badly
  stringToPair(s: string) {
    const pair = JSON.parse(s);
    const name: string = Object.keys(pair.data.rates)[0];
    const time: number = pair.time;
    const formatted = {
      name,
      ...pair.data.rates[name],
      time
    };

    return formatted; 
  }

  constructor(name: string, interval: number) {
    this.name = name;
    this.interval = interval;
    this.getUrl = `${url}?pairs=${name}`;
    this.req = new Req(this.getUrl);
    this.oldPair = ''; 
    this.uuid = uuidv1(); 
  };

  // Get last pair data 
  // ======================================================
  // TODO options like last, etc. 
  // Add more functionality to db lib?
  public getLast = (full: boolean) => new Promise<string>((resolve, reject) => {
    m_pair.findOne().sort('-date_created').lean().exec((err, pair) => {
      if (err) return resolve(JSON.stringify(err));
      console.log('foud one -> ', pair);
      if (full) return resolve(JSON.stringify(pair));
      resolve(JSON.stringify(pair.pair));
    });
  });

  // Get rate from API 
  // ======================================================
  // TODO this...
  private getRate = async function(this: any): Promise<_pairData> {
    return await this.req.get().then((r: string) => {
      const pair: _pairData = this.stringToPair(r);
      console.log('pair: ', pair);
      return pair;
    }).catch((e: string) => {
      return e;
    });
  };

  public init = async () => {
    const last = await this.getLast(false).then((r: string) => JSON.parse(r));
    const run = async (pair: _pairData) => {
      // TODO handle if last pair does not exist
      // create a new one and make it last
      if (!pair) return console.log(':('); 
      const newRate: _pairData = await this.getRate(); 
      console.log('-------', new Date(), '-------');
      console.log('new rate: ', newRate.rate);
      console.log('last rate: ', pair);
      if (pair.rate !== newRate.rate) {
        console.log('rate changed.. save..');
        const saved: boolean = await this.save(newRate, pair).then(r => r);
        if (!saved) return run(pair);
        console.log('saved...');
        return run(newRate);
      }
      return run(pair);
    };
    return run(last);
  };

  public save = (data: _pairData, lastPair: _pairData) => new Promise<boolean>(resolve => {
    // TODO type
    console.log(`saving...[${data.name}]`);
    // check if pair exists
    this.getLast(true).then((r: string) => {
      // TODO error and etc... 
      const uuid: string = JSON.parse(r).uuid;
      console.log('uuid: ', uuid);
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

