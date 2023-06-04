var express = require('express');
const db = require('../database');
var router = express.Router();
const request = require ('request');
const ip = require ('ip');
const nodemailer = require('nodemailer');

router.post('/', function(req, res, next) {
  const captcha = req.body['g-recaptcha-response'];
  const secretKey = "6LfoPWUmAAAAAMVVwUuXQzddeqaFCXQb6Y93ehNv";
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}`;
  let name = req.body.name;
  let email = req.body.email;
  let comment = req.body.comment;
  let date = new Date();
  let fecha = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  let Datetime = fecha;
  //Validando todo el formulario
  request(url, (err, response, body) => {
    if(err) {
      console.error(err);
      res.redirect('/');
    }else if(response.statusCode !== 200){
      console.error(`Código de estado HTTP no válido: ${response.statusCode}`);
      res.redirect('/');
    }else{
      request(`http://ip-api.com/json/`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          const data = JSON.parse(body);
          let country = data.country;
          let query = data.query;
          //Mostrar datos ingresados pos consola
          console.log({name, email, comment, Datetime, query, country});
          //Insertar daton en la base de datos
          db.insert(name, email, comment, Datetime, query, country);
          
          
          //Enviar email con los datos ingresados 
          const transporter = nodemailer.createTransport({
            host: "smtp.hostinger.com",
            port: 465,
            secure: true,
            auth: {
                user: "test009@arodu.dev",
                pass: "eMail.test009"
            }
          });
          const mailOptions = {
            from: "test009@arodu.dev",
            //Lista de correos 
            to: ['eserxzd@gmail.com', 'programacion2ais@dispostable.com'],
            subject: 'Task 3: Third Party Connection ',
            text: 'Un nuevo ususuario se ha registrado en el formulario:\n' + 'Nombre: ' + name + '\nCorreo: ' + email + '\nMensaje: ' + comment + '\nFecha y hora: ' + Datetime + '\nIP: ' + query + '\nUbicacion: ' + country
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Correo electrónico enviado: ' + info.response);
            }
          });
        }
      });
      console.log('exitoso')
      res.redirect('/');
    }
  });
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express'});
});

module.exports = router;
