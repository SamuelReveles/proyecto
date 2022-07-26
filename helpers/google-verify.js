const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');
const format = require('date-fns/format');
const es = require('date-fns/locale/es');

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

    let calendario_nutriologo = nutriologo.calendario;

    let nombre = cliente.nombre + ' ' + cliente.apellid;

    if(extra != '') nombre = extra;
  
    //Hora de finalización de la llamada
    let hora_cierre = new Date(hora_inicio);
    hora_cierre.setMinutes(hora_inicio.getMinutes() + 30);
  
    const event = {
        summary: 'Cita con el(la) nutricionista ' + nutriologo.nombre,
        description: 'Evento de llamada para la atención del servicio de nutrición de ' + nombre + 
        '\nRecuerde las indicaciones del nutriólogo: \n' + nutriologo.indicaciones,
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
        },
        colorId: 2
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

      //Fecha en string
      const fechaArr = format(hora_inicio, 'dd-MMMM-yyyy', {locale: es}).split('-');
      const fechaString = fechaArr[0] + ' de ' + fechaArr[1] + ' del ' + fechaArr[2];
      
      let encontrado = false;

      ///Guardar en el calendario del nutriólogo
      function comparar(a, b) {
          if (a.hora < b.hora) return -1;
          if (b.hora < a.hora) return 1;
      }

      for (let i = 0; i < calendario_nutriologo.length; i++) {
          if(calendario_nutriologo[i].dia == fechaString){
              const hora = format(hora_inicio, 'hh:mm');
              encontrado = true;
              calendario_nutriologo[i].pacientes.push({
                  hora,
                  servicio: idServicio,
                  llamada: event.data.hangoutLink,
                  paciente: nombre
              });
              calendario_nutriologo[i].pacientes = calendario_nutriologo[i].pacientes.sort(comparar);
              break;
          }
      }

      if(encontrado === false) {
          const hora = format(hora_inicio, 'hh:mm');
          calendario_nutriologo.push({
              dia: fechaString,
              date: hora_inicio,
              pacientes:[{
                  hora,
                  servicio: idServicio,
                  llamada: event.data.hangoutLink,
                  paciente: nombre
              }]
          });
      }

      calendario_nutriologo = calendario_nutriologo.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      await Nutriologo.findByIdAndUpdate(idNutriologo, {calendario: calendario_nutriologo});

      //Guardar en el calendario del cliente
      const calendario = {
        linkMeet: event.data.hangoutLink,
        fecha_cita: hora_inicio,
        nombre
      }

      const servicio = await Servicio.findById(idServicio);
      if(extra != '') await Extra.findByIdAndUpdate(servicio.id_paciente, {calendario: calendario});
      else await Cliente.findByIdAndUpdate(servicio.id_paciente, {calendario: calendario});
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
        '\nRecuerde las indicaciones del nutriólogo: \n' + nutriologo.indicaciones,
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
        },
        colorId: 2
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

        //Actualizar calendario del nutriólogo
        const fecha_cita = hora_nueva;

        let calendario_nutriologo = [];
        if(nutriologo.calendario) calendario_nutriologo = nutriologo.calendario;

        let fechaArr = format(fecha_cita, 'dd-MMMM-yyyy', {locale: es}).split('-');
        let fechaString = fechaArr[0] + ' de ' + fechaArr[1] + ' del ' + fechaArr[2];

        let { nombre, apellidos } = await Cliente.findById(servicio.id_paciente);

        if(!nombre) { 
            let extra = await Extra.findById(servicio.id_paciente);
            nombre = extra.nombre;
            apellidos = extra.apellidos;
        }

        let encontrado = false;

        function comparar(a, b) {
            if (a.hora < b.hora) return -1;
            if (b.hora < a.hora) return 1;
        }

        for (let i = 0; i < calendario_nutriologo.length; i++) {
            if(calendario_nutriologo[i].dia == fechaString){
                const hora = format(fecha_cita, 'hh:mm');
                encontrado = true;
                calendario_nutriologo[i].pacientes.push({
                    hora,
                    servicio: servicio._id,
                    llamada: event.data.hangoutLink,
                    paciente: nombre + ' ' + apellidos
                });
                calendario_nutriologo[i].pacientes = calendario_nutriologo[i].pacientes.sort(comparar);
                break;
            }
        }

        if(encontrado === false) {
            const hora = format(fecha_cita, 'hh:mm');
            calendario_nutriologo.push({
                dia: fechaString,
                date: fecha_cita,
                pacientes:[{
                    hora,
                    servicio: servicio._id,
                    llamada: event.data.hangoutLink,
                    paciente: nombre + ' ' + apellidos
                }]
            });
        }

        await Nutriologo.findByIdAndUpdate(nutriologo._id, {calendario: calendario_nutriologo});

        //Actualizar calendario del cliente
        if(cliente) {
          cliente.calendario.linkMeet = event.data.hangoutLink;
          cliente.calendario.fecha_cita = hora_nueva;

          console.log(cliente.calendario);
          await Cliente.findByIdAndUpdate(servicio.id_paciente, cliente);
        }
        else {
          const extra = await Extra.findById(servicio.id_paciente);

          extra.calendario.linkMeet = event.data.hangoutLink;
          extra.calendario.fecha_cita = hora_nueva;

          console.log(extra.calendario);
          await Extra.findByIdAndUpdate(servicio.id_paciente, extra);
        }

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