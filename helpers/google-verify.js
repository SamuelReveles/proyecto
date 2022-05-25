const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');

const calendar = google.calendar('v3');

//Modelos
const Nutriologo = require('../models/nutriologo');
const Cliente = require('../models/cliente');
const Servicio = require('../models/servicio');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function googleVerify(token = '') {

  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
  });

  const { given_name, family_name, email } = ticket.getPayload();

  return {
      nombre: given_name,
      apellidos: family_name,
      correo: email
  }

}

async function crearEvento(hora_inicio = new Date(), hora_cierre = new Date(), idCliente, idNutriologo) {

    // const { nombreNutriologo, correoNutriologo } = await Nutriologo.findById(idNutriologo);
    // const { nombreCliente, correoCliente } = await Cliente.findById(idCliente);

    const event = {
        summary: 'Consulta con el(la) nutriólogo(a)' ,
        description: 'Llamada con el nutriólogo ',
        start: {
          dateTime: hora_inicio,
          timeZone: 'America/Mexico_City',
        },
        end: {
          dateTime: hora_cierre,
          timeZone: 'America/Mexico_City',
        },
        attendees: [
          {email: 'a18300384@ceti.mx'},
          {email: 'sabyreveles@gmail.com'},
        ],
      };
      
      calendar.events.insert({
        project: process.env.GOOGLE_CALENDAR_API,
        calendarId: 'primary',
        resource: event,
      }, function(err, event) {
        if (err) {
          console.log('There was an error contacting the Calendar service: ' + err);
          return new Error('Error al crear');
        }
        console.log('Event created: %s', event.htmlLink);
        console.log(event);
      });
      
}

async function cambiarFecha (id_servicio) {

  const servicio = await Servicio.findById(id_servicio);

  return true;

}
module.exports = {
    googleVerify,
    crearEvento
}