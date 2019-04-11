import mongoose from 'mongoose';

export default class DB {
  private uri: string;
  constructor(uri: string) {
    this.uri = uri;
  };

  // TODO logger: pass it as a function
  public connect() {
    console.log(`connecting to ${this.uri}...`);
    mongoose.connect(this.uri, { useNewUrlParser: true }); 
  };
}
