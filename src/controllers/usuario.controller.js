const Usuario = require('../models/usuario.models')
const bcrypt = require('bcrypt-nodejs')
const jwt = require('../services/jwt')
const { restart } = require('nodemon')

function generarMaestro(req, res) {
    var parametros = req.body
    var usuarioModel = new Usuario()



    Usuario.findOne({ email: 'maestro@kinal.edu.gt' }, (err, usuarioEncontrado) => {
        if (usuarioEncontrado) {
            return res.status(200).
                send({ mensaje: 'El usuario del maestro principal ya existe' })

        } else {
            usuarioModel.nombre = "Maestro";
            usuarioModel.password = '123456'
            usuarioModel.email = 'maestro@kinal.edu.gt'
            usuarioModel.apellido = 'Principal'
            usuarioModel.rol = 'MAESTRO'

            usuarioModel.save((err, usuarioGuardado) => {
                if (err) return res.status(500).
                    send({ mensaje: 'Error en la peticion' })
                if (!usuarioGuardado) return res.status(500).
                    send({ mensaje: 'Error al agregar al usuario' })


                return res.status(200).
                    send({ mensaje: 'El usuario del maestro principal ha sido creado' })

            })

        }
    })


}

function Registrar(req, res) {
    var parametros = req.body
    var usuarioModel = new Usuario()

    if (parametros.nombre && parametros.apellido &&
        parametros.email && parametros.password) {
        usuarioModel.nombre = parametros.nombre;
        usuarioModel.apellido = parametros.apellido;
        usuarioModel.email = parametros.email;
        usuarioModel.password = parametros.password;
        usuarioModel.rol = 'ALUMNO';

        console.log('Se estan insertando datos');

        Usuario.find({ email: parametros.email }, (err, usuarioEncontrado) => {
            if (usuarioEncontrado.length == 0) {

                bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                    usuarioModel.password = passwordEncriptada;

                    usuarioModel.save((err, usuarioGuardado) => {
                        if (err) return res.status(500)
                            .send({ mensaje: 'Error en la peticion' });
                        if (!usuarioGuardado) return res.status(500)
                            .send({ mensaje: 'Error al agregar al usuario' });

                        return res.status(200).send({ usaurio: usuarioGuardado });
                    });
                });
            } else {
                return res.status(500)
                    .send({ mensaje: 'Este correo ya  se encuentra utilizado' });
            }
        })

    }
}

function LogIn(req, res) {
    var parametros = req.body
    Usuario.findOne({ email: parametros.email }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
        if (usuarioEncontrado) {
            bcrypt.compare(parametros.password, usuarioEncontrado.password,
                (err, verificacionPassword) => {
                    if (verificacionPassword) {
                        if (parametros.obtenerToken === 'true') {
                            return res.status(200).
                                send({ token: jwt.crearToken(usuarioEncontrado) })
                        } else {
                            usuarioEncontrado.password = undefined
                            return res.status(200).
                                send({ usuario: usuarioEncontrado })
                        }
                    } else {
                        return res.status(500).
                            send({ mensaje: 'La contraseña no coincide' })
                    }
                })
        } else {
            return res.status(500).
                send({ mensaje: 'El correo no se encuentra registrado' })
        }
    })
}

function EditarUsuario(req, res) {

    var idUser = req.params.idUsuario;
    var parametros = req.body;

    if (idUser !== req.user.sub) return res.status(500)
        .send({ mensaje: 'No puede editar otros usuarios' });

    Usuario.findByIdAndUpdate(req.user.sub, parametros, { new: true },
        (err, usuarioActualizado) => {
            if (err) return res.status(500)
                .send({ mensaje: 'Error en la peticion' });
            if (!usuarioActualizado) return res.status(500)
                .send({ mensaje: 'Error al editar el Usuario' });
            /*if (req.body.obtenerToken != "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MjBkYjAzYjQ3OWViMjQ0YmJmMTI2YmEiLCJub21icmUiOiJEaWVnbyIsImVtYWlsIjoiZHBpbnpvbkBnbWFpbC5jb20iLCJyb2wiOiJBTFVNTk8iLCJpYXQiOjE2NDUwNjY4ODQsImV4cCI6MTY0NTQxMjQ4NH0.AzO7IQFLfA0mige96leJYMGivbiFWVqg7elhx6IR4wk")
                return res.status(500).
                    send({ mensaje: 'No tiene acceso para esta accion' });*/
            return res.status(200).send({ usuario: usuarioActualizado })
        })
}

module.exports = {
    Registrar,
    LogIn,
    EditarUsuario,
    generarMaestro
}