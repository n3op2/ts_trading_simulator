import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export default new Schema({
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
      type: String
    }
  },
  four_hours_now: String,
  rate: Number,
  date_created: Number,
  date_last_four: Number,
});
