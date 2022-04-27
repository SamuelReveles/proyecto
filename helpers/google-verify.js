const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;

//Modelos
const Nutriologo = require('../models/nutriologo');
const Cliente = require('../models/cliente');

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

    const { nombreNutriologo, correoNutriologo } = await Nutriologo.findById(idNutriologo);
    const { nombreCliente, correoCliente } = await Cliente.findById(idCliente);
    const oAuth2Cliente = new OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_SECRET_ID
    );
    oAuth2Cliente.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    })

    const calendar = google.calendar({ version:'v3', auth: oAuth2Cliente });

    const event = {
        summary: 'Consulta con el(la) nutriólogo(a)' ,
        description: 'Llamada con el nutriólogo ' + nombreNutriologo,
        start: {
          dateTime: hora_inicio,
          timeZone: 'America/Mexico_City',
        },
        end: {
          dateTime: hora_cierre,
          timeZone: 'America/Mexico_City',
        },
        attendees: [
          {email: correoCliente},
          {email: correoNutriologo},
        ],
      };
      
      calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      }, function(err, event) {
        if (err) {
          console.log('There was an error contacting the Calendar service: ' + err);
          return;
        }
        console.log('Event created: %s', event.htmlLink);
        console.log(event);
      });
      
}
module.exports = {
    googleVerify,
    crearEvento
}