const mongoose = require('mongoose');

const dbConnection = async() => {
    try {//Haciendo conexión a mongoose

        await mongoose.connect(process.env.MONGODB_KEY, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("Base de datos conectada (Online)");

    }catch(error) {
        console.error(error);
        throw new Error('Error al iniciar la DB');
    }
}

module.exports = {
    dbConnection
}