const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config()

const app = express();
const config = require('./config');
const api = require('./api');

app.use(express.json());
app.use('/api', api);
app.use('/api/v1', api);
app.use(express.static('./public'));

mongoose.connect(`mongodb+srv://${config.db.user}:${config.db.password}@${config.db.host}/${config.db.name}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true})

app.listen(process.env.PORT || config.server.port, ()=>{
    console.log("Servidor iniciado ...")
}); 