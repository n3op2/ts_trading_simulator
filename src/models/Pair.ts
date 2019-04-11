import mongoose from 'mongoose';
import PairSchema from '../schemas/Pair';

const pair = mongoose.model('Pair', PairSchema); 

export const Pair = {
  create: function() {
    const rate = new pair({
      uuid: 'uuid',
      four_hours_now: '4hn',
    });
    rate.save((err) => {
      if (err) return console.log('Erro: ', err);
      console.log(`saved [${rate}]`);
    });
  }
};

