require('dotenv').config();
//Server
const Server = require('./models/server');

//Instance
const server = new Server();
server.listen();