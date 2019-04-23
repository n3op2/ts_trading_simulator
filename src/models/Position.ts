import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const positionSchema = new Schema({
  uuid: {
    type: String,
    required: [ true, 'uuid must be provided' ]
  },
  pair_uuid: {
    type: String
  },
  line_uuid: {
    type: String
  },
  rates: {
    entry: {
      type: Number
    },
    exit: {
      type: Number
    }
  },
  open: {
    type: boolean
  },
  date_created: {
    type: Number,
    default: () => new Date().getTime()
  }
});

const Position = mongoose.model('pairs', postionSchema);

export default Position;

