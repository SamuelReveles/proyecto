const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('../database/config');

class Server{
    constructor(){
        //Se usa el framework de express
        this.app = express();
        //Página principal
        this.app.use(express.static('../public/index.html'));
        //Numero de puerto (.env)
        this.port = process.env.PORT;
        //Dirección de pruebas
        this.usuariosPath = '/api/usuarios';
        this.adminPath = '/api/administrador';
        this.nutriologoPath = '/api/nutriologo';
        this.authPath = '/api/auth';
        this.triggerPath = '/api/trigger';
        //Conectar a base de datos
        this.conectarDB();
        //Middlewares
        this.middlewares();
        //Rutas de la app
        this.routes();
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
    }

    listen(){
        //Se selecciona un puerto por que el que va a escuchar el server
        this.app.listen(this.port, (req, res) => {
            console.log('listening on port', this.port);
        });
    }
}

module.exports = Server;