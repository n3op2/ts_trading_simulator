import mongoose from 'mongoose';
import PairSchema from '../schemas/Pair';
import Req from '../lib/request';
import uuidv1 from 'uuid';
import axios from 'axios';

const pair = mongoose.model('pairs', PairSchema); 
const url: string = 'https://www.freeforexapi.com/api/live';
// const url: string = 'https://api.exchangeratesapi.io/latest';

export interface IPair {
  uuid: string;
};

export default class Pair implements IPair {
  private getUrl: string;
  private name: string;
  private req: Req;
  uuid = uuidv1();

  constructor(name: string) {
    this.name = name;
    this.getUrl = `${url}?pairs=${name}`;
    this.req = new Req(this.getUrl);
  };

  public init = async () => {
    const res = await this.req.get().then(res => JSON.parse(res));
    console.log(res.data);
  };

  public create = async (rate: number, fhn: string, cb: (res: boolean) => void) => {
    const _pair = new pair({
      uuid: this.uuid 
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

