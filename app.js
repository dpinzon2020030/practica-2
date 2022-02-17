// IMPORTACIONES
const express = require('express');
const cors = require('cors');
var app = express();

// IMPORTACIONES RUTAS
//const EjemploRutas = require('./src/routes/ejemplo.routes');
const UsuarioRutas = require('./src/routes/usuario.routes');
//const EncuestaRutas =require('./src/routes/encuesta.routes');

// MIDDLEWARES -> INTERMEDIARIOS
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CABECERAS
app.use(cors());

// CARGA DE RUTAS localhost:3000/api/obtenerProductos
app.use('/api', UsuarioRutas);


module.exports = app;