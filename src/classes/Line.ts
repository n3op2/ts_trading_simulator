import m_line from '../models/Line';
import uuidv1 from 'uuid';

type _config = {
  pair_uuid: string,
  stop_loss: number,
  rate: number,
  test1: number,
  test2: number
};

export default class Line {
  uuid: string;
  pair_uuid: string;
  stop_loss: number;
  test1: number;
  test2: number;
  rate: number;

  constructor(config: _config) {
    this.uuid = uuidv1();
    this.pair_uuid = config.pair_uuid;
    this.stop_loss = config.stop_loss;
    this.rate = config.rate;
    this.test1 = config.test1;
    this.test2 = config.test2;
  };

  private pipsToRate = (pips: number, rate: number): number => pips / 10000 + rate;

  private getLine = (uuid: string) => new Promise<string>((resolve, reject) => {
    m_line.findOne({ uuid: uuid }).exec((err: string, line: any) => {
      if (err) return resolve(JSON.stringify(err));
      resolve(line);
    });
  });

  public save = (props: any) => new Promise<boolean>(resolve => {
    const reward: number = props.stop_loss * props.risk;
    const sell: number = this.pipsToRate(reward, props.line_rate);
    const stop_loss: number = this.pipsToRate(-props.stop_loss, props.line_rate);

    const data = {
      uuid: this.uuid,
      pair_uuid: props.pair_uuid,
      rates: {
        line: props.line_rate,
        stop_loss: stop_loss,
      },
      risk: props.risk,
      sell,
      actions: 'buy'
    };
    console.log('new data: ', data);
    const line = new m_line(data);
    line.save((err, res) => {
      if (err) return resolve(false);
      resolve(true);
    });
  });

  // TODO any, general types for pairs/lines
  public work = (pair: any, lineUuid: string) => new Promise<boolean>(resolve => {
    console.log('hi my name is line', pair);
    console.log('line.work()', pair);

    this.getLine(lineUuid).then((line: any) => {
      console.log('lines found: ', line);

      if (pair.rate <= line.rates.line) {
        // TODO position should open one...
        console.log('trigger buy action....');
      } else if (pair.rate > line.rates.stop_loss) {
        console.log('more than stop loss');
      }

      resolve(false);
    }).catch(() => resolve(false));
  });
};

