import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export default new Schema({
  uuid: String,
  pair_name: String,
  four_hours_now: String,
  rate: Number,
  date_created: Number,
  date_last_four: Number,
});
