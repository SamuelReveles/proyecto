require('dotenv').config();
//Server
const Server = require('./models/server');

//Instancia de servidor
const server = new Server();
server.listen();