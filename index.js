const express = require('express')
const app = express()
const port = 8080;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.get('/', (req, res) => {
  res.send('Hello World!')
})
const products = require('./api/product');
app.get('/api/products', products.get);
app.post('/api/products', products.post);
const transaction = require('./api/transaction');
app.get('/api/transaction', transaction.get);
app.post('/api/transaction', transaction.post);
app.delete('/api/transaction/:id', transaction.delete);
app.put('/api/transaction/:id', transaction.update);
app.listen(port, () => { console.log(`Server berjalan di PORT: ${port}`) });