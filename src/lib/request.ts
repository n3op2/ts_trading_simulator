import axios from 'axios';

const headers: object = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
}

export default class Get {
  // TOTO: get url from config module
  private url: string;
  constructor(url: string) {
    this.url = url;
  };

  public get = () => new Promise<string>((resolve) => {
    // sends response 'Content-Type': 'text/html';
    axios.get(this.url, headers).then(res => { 
      const response: object = {
        status: res.status,
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
