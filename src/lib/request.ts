import axios from 'axios';
import uuidv1 from 'uuid';

type _headers = {
  'Content-Type': string;
  Accept: string;
  [key: string]: string;
};

type _options = {
  headers: _headers; 
};

export default class Get {
  // TOTO: get url from config module + constructor suffix
  private uuid: string;
  private options: _options;
  private url: string;

  constructor(url: string) {
    this.url = url;
    this.uuid = uuidv1();
    this.options = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }
    };
  };

  private now = (): number => new Date().getTime();

  public get = () => new Promise<string>((resolve, reject) => {
    // sends response 'Content-Type': 'text/html';
    const start: number = this.now();
    axios.get(this.url, this.options).then(res => { 
      const end: number = this.now(); 
      const response: object = {
        uuid: this.uuid, 
        status: res.status,
        resTime: `${end - start}ms`,
        timestamp: new Date().getTime(),
        data: res.data
      };
      resolve(JSON.stringify(response));
    }).catch(err => {
      const end: number = this.now(); 
      const error: object = {
        uuid: this.uuid, 
        code: err.code,
        resTime: `${end - start}ms`,
        timestamp: new Date().getTime(),
        data: err.config
      };
      reject(JSON.stringify(error));
    });
  });
};
