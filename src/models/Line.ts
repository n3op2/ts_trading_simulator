import mongoose from 'mongoose';

const Schema = mongoose.Schema;

type _val = string | [ boolean, string ];

const lineSchema = new Schema({
  uuid: {
    type: String,
  },
  pair_uuid: {
    type: String,
  },
  rates: {
    line: {
      type: Number,
    },
    test2: {
      type: Number
    },
    test1: {
      type: Number
    },
    stop_loss: {
      type: Number
    },
  },
  risk: {
    type: Number 
  },
  sell: {
    type: Number,
  },
  action: {
    type: String,
    enum: [ 'short', 'buy' ]
  },
  date_created: {
    type: Number,
    default: () => new Date().getTime()
  }
});

// TODO move it to utils so it can be used across all models/schemas
// excludes / includes?
/*
const applyGlobalProp = (prop: string, val: _val ) => {
  const recursive = (schema: any) => { 
    Object.keys(schema).map(key => {
      if (typeof schema[key] === 'object') {
        if (!schema[key][prop]) {
          console.log('key: ', schema[key]);
          schema[key][prop] = val;
        }
      }
      if (typeof schema[key] === 'object' && schema[key].constructor === Array) {
        recursive(schema[key]);
      }
    });
  }
  return recursive(lineSchema);
};
*/

const Line = mongoose.model('lines', lineSchema);

export default Line 

