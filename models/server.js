const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('../database/config');

//Socket controller
const { socketController } = require('../controllers/sockets');

class Server{
    constructor(){
        //Se usa el framework de express
        this.app = express();
        //Página principal
        this.app.use(express.static('../public/index.html'));
        //Numero de puerto (.env)
        this.port = process.env.PORT;
        //Server para los sockets
        this.server = require('http').createServer(this.app);
        //Socket
        this.io = require('socket.io')(this.server, {cors: { origin: ['http://localhost:4200', 'http://localhost:8080', 'https://jopaka-app.com'], credentials: true }});
        //Dirección de pruebas
        this.usuariosPath = '/api/usuarios';
        this.adminPath = '/api/administrador';
        this.nutriologoPath = '/api/nutriologo';
        this.authPath = '/api/auth';
        this.triggerPath = '/api/trigger';
        this.invitadoPath = '/api/invitado';
        //Conectar a base de datos
        this.conectarDB();
        //Middlewares
        this.middlewares();
        //Rutas de la app
        this.routes();
        //Activar sockets
        this.sockets();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares() {
        //CORS
        this.app.use(cors());
        //Leer y parsear el body
        this.app.use(express.json());
        //Directorio público
        this.app.use(express.static('public'));
        //Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/'
        }));
    }

    routes() {
        //Rutas
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
        this.app.use(this.adminPath, require('../routes/administrador'));
        this.app.use(this.nutriologoPath, require('../routes/nutriologo'));
        this.app.use(this.authPath, require('../routes/autenticacion'));
        this.app.use(this.triggerPath, require('../routes/trigger'));
        this.app.use(this.invitadoPath, require('../routes/invitados'));
    }

    sockets() {
        this.io.on('connection', socketController);
        // this.io.on('connection', (payload) => { console.log ('conectado')});
    }

    listen(){
        //Se selecciona un puerto por que el que va a escuchar el server
        this.server.listen(this.port, (req, res) => {
            console.log('listening on port', this.port);
        });
    }
}

module.exports = Server;