const { response } = require('express');
const bcryptjs = require('bcryptjs');
const client = require('twilio')(process.env.TWILIO_SSID, process.env.TWILIO_AUTH_TOKEN);

const cliente = require('../models/cliente');
const dato = require('../models/dato');
const Nutriologo = require('../models/nutriologo');

const usuariosGet = async(req, res = response) => {

    const {q, nombre = 'No name', apiKey, celular} = req.query;

    //Guardar el número en una constante para enviarlo
    const numero = '+' + celular;
    console.log(numero);

    //Creando un mensaje de texto
    client.messages.create({
        to: numero,
        from: '+19362377651',
        body: 'Hola desde twilio',
    })
    .then(message => console.log(message.sid));

    res.json({
        msg: 'get API - controller',
        q,
        nombre,
        apiKey,
        celular
    });
}

const usuariosPut = async(req, res = response) => {
    const id = req.params;
    const {password, google, correo, ...resto} = req.body;

    //Validar contra base de datos
    if(password){
        //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const Usuario = await Usuario.findOneAndUpdate(id, resto);

    res.json({
        ok: true,
        msg: "put API - controller",
        id
    });
}

const usuariosPost = async(req, res = response) => {
    
    //Enviar asisgar número de telefono

    console.log(req.body.celular);
    console.log(req.body.channel)

    // // Extraer ID y número
    client
        .verify
        .services(process.env.ServiceID)
        .verifications
        .create({
            to: '+' + req.body.celular,
            channel: req.body.channel
        })
        .then(data => {
            res.status(200).send(data);
        })

    // // Guardar el número en una constante para enviarlo
    // const numero = '+' + celular;
    // console.log(numero);

    // // Creando un mensaje de texto
    // // client.messages.create({
    // //     to: numero,
    // //     from: '+19362377651',
    // //     body: 'Hola desde twilio',
    // // })
    // // .then(message => console.log(message.sid));

    const datos = new dato({
        peso: 78.50,
        altura: 180,
        fecha_nacimiento: new Date(2003, 05, 28)
    });

    const user = new cliente({
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        celular: req.body.celular,
        correo: req.body.email,
        datos
    });

    await user.save()
        .then(await datos.save());
    // //Encriptar la contraseña del usuario
    // const salt = bcryptjs.genSaltSync();
    // usuario.password = bcryptjs.hashSync(password, salt);
    // //Guardar en DB
    // await usuario.save();
    
    res.status(201).json({
        ok: true,
        user
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'patch API - controller'
    });
};

const usuariosDelete = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'delete API - controller'
    });
};

const busqueda = async (req, res = response) => {

    // Búsqueda por nombre
    const nombre = {nombreCompleto : req.query.nombre};

    const {limit = 10, start = 0} = req.query;

    const [total, users] = await Promise.all([
        Nutriologo.count(),
        Nutriologo.find(nombre)
            .skip(Number(start))
            .limit(Number(limit))
    ]);

    res.json({
        total,
        users
    });
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch,
    busqueda
}