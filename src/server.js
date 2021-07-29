if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');
// deprecated now we use  app.use(express.urlencoded({extended: true}));  const bodyParser = require('body-parser');
const GNRequest = require('./apis/gerencianet');

const app = express();

// app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
app.use(require('./routes'))

app.set('view engine', 'ejs');
app.set('views', 'src/views');



const port = process.env.PORT || 3000
app.listen(port, () => {console.log(`Listening on port ${port}...`)})
