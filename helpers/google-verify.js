const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');

const calendar = google.calendar('v3');

//Modelos
const Nutriologo = require('../models/nutriologo');
const Cliente = require('../models/cliente');
const Servicio = require('../models/servicio');
const Extra = require('../models/extra');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_SECRET_ID,
  'http://localhost:8080'
);

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

async function crearEvento(hora_inicio = new Date(), idCliente, idNutriologo, idServicio, extra = '') {

  try {
    const nutriologo = await Nutriologo.findById(idNutriologo);
    const cliente = await Cliente.findById(idCliente);

    let nombre = cliente.nombre;

    if(extra != '') nombre = extra;
  
    //Hora de finalización de la llamada
    let hora_cierre = new Date(hora_inicio);
    hora_cierre.setMinutes(hora_inicio.getMinutes() + 30);
  
    const event = {
        summary: 'Cita con el(la) nutricionista ' + nutriologo.nombre,
        description: 'Evento de llamada para la atención del servicio de nutrición de ' + nombre + 
        '\nRecuerde las indicaciones del nutriólogo: ' + nutriologo.indicaciones,
        start: {
          dateTime: hora_inicio,
          timeZone: 'America/Mexico_City',
        },
        end: {
          dateTime: hora_cierre,
          timeZone: 'America/Mexico_City',
        },
        attendees: [
          {email: cliente.correo},
          {email: nutriologo.correo},
        ],
        conferenceData: {
          createRequest: { 'requestId': (Math.random() + 1).toString(36).substring(7) }
        }
      };
  
    oauth2Client.setCredentials({refresh_token: process.env.GOOGLE_CALENDAR_REFRESH_TOKEN});
  
    calendar.events.insert({
      auth: oauth2Client,
      project: process.env.GOOGLE_CALENDAR_API,
      calendarId: 'primary',
      resource: event,
      sendNotifications: true,
      conferenceDataVersion: 1
    }, async function(err, event) {
      if (err) {
        console.log('There was an error contacting the Calendar service: ' + err);
        return new Error('Error al crear');
      }
      //Guardar en el servicio el link de meet
      await Servicio.findByIdAndUpdate(idServicio, {linkMeet: event.data.hangoutLink, eventId: event.data.id});
    });
  } catch (error) {
    console.log(error);
  }

}

async function cambiarFecha (idServicio, hora_nueva) {

  try {
    const servicio = await Servicio.findById(idServicio);

    const idNutriologo = servicio.id_nutriologo;
    const idCliente = servicio.id_paciente;

    let correo, nombre;
  
    const nutriologo = await Nutriologo.findById(idNutriologo);

    let cliente = await Cliente.findById(idCliente);

    if(cliente){
      correo = cliente.correo;
      nombre = cliente.nombre;
    }
    //Si es un extra
    else {
      const extra = await Extra.findById(idCliente);
      nombre = extra.nombre;

      const clientes = await Cliente.find();

      for await (const user of clientes) {
        //Revisar extras
        if(user.extra1) {
          if(String(user.extra1) == String(idCliente)){
            correo = user.correo;
            break;
          }
        }
        if(user.extra2) {
          if(String(user.extra2) == String(idCliente)){
            correo = user.correo;
            break;
          }
        }
      }
    }

    let hora_cierre = new Date(hora_nueva);
    hora_cierre.setMinutes(hora_nueva.getMinutes() + 30);
  
    const event = {
        summary: 'Cita con el(la) nutricionista ' + nutriologo.nombre,
        description: 'Evento de llamada para la atención del servicio de nutrición de ' + nombre + 
        '\nRecuerde las indicaciones del nutriólogo: ' + nutriologo.indicaciones,
        start: {
          dateTime: hora_nueva,
          timeZone: "America/Mexico_City"
        },
        end: {
          dateTime: hora_cierre,
          timeZone: "America/Mexico_City"
        },
        attendees: [
          {email: correo},
          {email: nutriologo.correo},
        ],
        conferenceData: {
          createRequest: { 'requestId': (Math.random() + 1).toString(36).substring(7) }
        }
      };
  
      oauth2Client.setCredentials({refresh_token: process.env.GOOGLE_CALENDAR_REFRESH_TOKEN});

      calendar.events.update({
        auth: oauth2Client,
        project: process.env.GOOGLE_CALENDAR_API,
        calendarId: 'primary',
        eventId: servicio.eventId,
        resource: event,
        sendNotifications: true,
        conferenceDataVersion: 1
      }, async function(err, event) {
        if (err) {
          console.log('There was an error contacting the Calendar service: ' + err);
          return new Error('Error al actualizar');
        }
        //Guardar en el servicio el link de meet
        await Servicio.findByIdAndUpdate(idServicio, {linkMeet: event.data.hangoutLink, eventId: event.data.id});
      });
  
    return true;
  } catch (error) {
    console.log(error);
  }

}
module.exports = {
    googleVerify,
    crearEvento,
    cambiarFecha
}