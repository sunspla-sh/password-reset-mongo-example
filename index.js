require('dotenv/config');

const express = require('express');
require('express-async-errors');

const connection = require('./db');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

const port = 8080;

(async function db(){
  await connection();
})();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

const indexRoutes = require('./routes/index.routes.js');
app.use('/api/v1', indexRoutes);

const authRoutes = require('./routes/auth.routes.js');
app.use('/api/v1/auth', authRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

app.listen(port, () => {
  console.log('listening on port ', port);
});