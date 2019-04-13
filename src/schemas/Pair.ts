import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export default new Schema({
  uuid: String,
  pair_name: String,
  rate: Number,
  four_hours_now: String,
  date_created: Number,
  date_changed: Date,
  date_last_four: Date
});
