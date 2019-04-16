import mongoose from 'mongoose';
import m_pair from '../schemas/Pair';
import Req from '../lib/request';
import uuidv1 from 'uuid';

const url: string = 'https://www.freeforexapi.com/api/live';
// const url: string = 'https://api.exchangeratesapi.io/latest';

type _resData = {
  status: number;
  resTime: string;
  name: string;
  data: any;
};

type _pairData = {
    name: string;
    rate: number;
    timestamp: number;
    time: number; 
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

  private now = () => new Date().getTime();

  public get = () => new Promise<string>((resolve, reject) => {
    m_pair.findOne().sort('-date_created').lean().exec((err, pair) => {
      if (err) return resolve(JSON.stringify(err));
      const {_id, ...filtered} = pair;
      resolve(JSON.stringify(filtered));
    });
  });

  public watch = () => new Promise<string>((resolve, reject) => {
    this.req.get().then(res => resolve(res)).catch(err => reject(err));
  });

  public save = (data: _pairData, lastPair: _pairData) => new Promise<boolean>(resolve => {
    // TODO type
    console.log(`saving...[${data.name}]`);
    const pair = new m_pair({
      uuid: this.uuid,
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
};

