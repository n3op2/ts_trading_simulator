import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const pairSchema = new Schema({
  uuid: {
    type: String,
    required: [ true, 'uuid must be provided' ]
  },
  pair: {
    name: {
      type: String,
      enum: [ 'EURUSD' ]
    },
    rate: {
      type: Number,
      required: [ true, 'missing rate prop' ]
    },
    timestamp: {
      type: Number,
      required: [ true, '1970/01/01' ]
    },
    time: {
      type: Number,
      required: [ true, 'latency time missing' ]
    }
  },
  date_updated: {
    type: Number
  },
  date_created: {
    type: Number,
    default: new Date().getTime()
  }
});

const Pair = mongoose.model('pairs', pairSchema);

export default Pair;

