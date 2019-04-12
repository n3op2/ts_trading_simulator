import mongoose from 'mongoose';
import PairSchema from '../schemas/Pair';
import uuidv1 from 'uuid';
import axios from 'axios';

const pair = mongoose.model('pairs', PairSchema); 
const url: string = 'https://www.freeforexapi.com/api/live';

/*
export const Pair = {
  create: function() {
    const rate = new pair({
      uuid: 'uuid',
      four_hours_now: '4hn',
    });
    rate.save((err) => {
      if (err) return console.log('Erro: ', err);
      console.log(`saved [${rate}]`);
    });
  }
};
*/

export interface IPair {
  uuid: string;
};

const GetData: (url: string, pair: string) => Promise<string> =
  function(url: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      axios.get(url).then((res) => {
        return resolve(JSON.stringify(res.data));
      }).catch((err) => {
        return reject(err);
      });;
    });
  };

export default class Pair implements IPair {
  private getUrl: string;
  private name: string;
  uuid = uuidv1();

  constructor(name: string) {
    this.name = name;
    this.getUrl = `${url}?pairs=${name}`;
  };

  public test = async (cb: (res: string) => void) => {
    await GetData(this.getUrl, this.name).then(pair => {
      return cb(pair);
    }).catch((err) => console.log(err));
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
