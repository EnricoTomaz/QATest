const express = require('express'); //  cria express application
const dotenv = require('dotenv');
const morgan = require('morgan'); // ferramenta de registro( logging)  simplifica processos.
const bodyparser = require("body-parser");
const path = require('path');


const connectDB = require('./server/database/connection');

const app = express();// cria express application
app.use(express.json());
dotenv.config()
const PORT = process.env.PORT || 8080

// log requests
app.use(morgan('tiny')); // esta linha de codigo instrui o node.js a usar o MORGAN com um presets chamdo tiny

// mongodb connection
connectDB();

// parse request to body-parser
app.use(bodyparser.urlencoded({ extended : true}))


// load routers
app.use('/', require('./server/routes/router'))

app.listen(PORT, ()=> { console.log(`Server is running on http://localhost:${PORT}`)});