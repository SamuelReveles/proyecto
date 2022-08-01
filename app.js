require('dotenv').config();
process.env.TZ = 'America/Mexico_City'
//Server
const Server = require('./models/server');

//Instancia de servidor
const server = new Server();
server.listen();