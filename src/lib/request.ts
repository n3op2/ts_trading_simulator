import axios from 'axios';

type _headers = {
  'Content-Type': string;
  Accept: string;
  [key: string]: string;
};

type _options = {
  headers: _headers; 
};

export default class Get {
  // TOTO: get url from config module
  private options: _options;
  private url: string;

  constructor(url: string) {
    this.url = url;
    this.options = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }
    };
  };

  public get = () => new Promise<string>((resolve) => {
    // sends response 'Content-Type': 'text/html';
    const start: number = new Date().getTime();
    axios.get(this.url, this.options).then(res => { 
      const end: number = new Date().getTime();
      const response: object = {
        status: res.status,
        resTime: `${end - start}ms`,
        name: 'name...',
        data: res.data
      };
      resolve(JSON.stringify(response));
    }).catch(err => {
      console.log('err: ', err);
      return resolve(JSON.stringify({ data: err }));
    });
  });
};
