import express from 'express';
import * as http from 'http';

const app = express();

app.get('/', (req, res) => {
  console.log('app.get(/)');
  res.end();
});

const server = http.createServer(app);

server.listen(3006, () => {
  console.log('Server has started...');
});



