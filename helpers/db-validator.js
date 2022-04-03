const Usuario = require('../models/cliente');

const celularExiste = async(celular = '') => {
    const celularExiste = await Usuario.findOne({celular});
    if(celularExiste) throw new Error('El celular está registrado');
}

const emailExiste = async(correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });
    if(existeEmail) throw new Error('El email está registrado');
};

module.exports = {
    emailExiste,
    celularExiste
}
