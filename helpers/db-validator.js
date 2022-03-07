const Role = require('../models/role');
const Usuario = require('../models/cliente');

const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({rol});
    if(!existeRol) throw new Error('El rol ' + rol + ' no está registrado en la BD');
};

const celularExiste = async(celular = '') => {
    const celularExiste = await Usuario.findOne({celular});
    if(celularExiste) throw new Error('El celular está registrado');
}

const emailExiste = async(correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });
    if(existeEmail) throw new Error('El email está registrado');
};

module.exports = {
    esRoleValido,
    emailExiste,
    celularExiste
}
