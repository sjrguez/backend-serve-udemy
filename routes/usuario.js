var express = require('express')
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken')

// var SEED = require('../config/config').SEED
var mdAutenticacion = require('../middleware/autenticacion')


var Usuario = require('../models/usuario')
var app = express()



// =======================================
//  Obtener todos los usuarios
// =======================================
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde)

    Usuario.find({}, 'nombre email img role google')

    .skip(desde)
        .limit(5)
        .exec(
            (error, usuarios) => {
                if (error) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: "Error cargando usuarios",
                        errors: error
                    })
                }
                Usuario.count({}, (error, conteo) => {
                    res.status(200).json({
                        ok: true,
                        usuario: usuarios,
                        total: conteo
                    })
                })



            })

})

// =======================================
// actualizar usuario
// =======================================
app.put("/:id", [mdAutenticacion.VerificarToken, mdAutenticacion.VerificarADMIN_o_MismoUser], (req, res) => {
    var id = req.params.id
    var body = req.body

    Usuario.findById(id, (error, usuario) => {

        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar usuario",
                errors: error
            })
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: "el usuario con el id" + " " + id + " " + "no existe",
                errors: { mensaje: " No existe el usuario" }
            })
        }

        usuario.nombre = body.nombre
        usuario.email = body.email
        usuario.role = body.role
        usuario.save((error, usuarioGuardado) => {

            if (error) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar usuario",
                    errors: error
                })
            }
            usuarioGuardado.password = ":)"
            res.status(201).json({
                ok: true,
                usuario: usuarioGuardado
            })

        })
    })






})


// =======================================
// crear un nuevo usuarios
// =======================================

app.post('/', (req, res) => {

    var body = req.body

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    })


    usuario.save((error, usuarioGuardado) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error al crear usuario",
                errors: error
            })
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        })
    })
})

// =======================================
// Eliminar usuario por el ID
// =======================================


app.delete('/:id', [mdAutenticacion.VerificarToken, mdAutenticacion.VerificarADMIN_o_MismoUser], (req, res) => {
    var id = req.params.id

    Usuario.findByIdAndRemove(id, (error, usuarioBorrado) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al borrar usuario",
                errors: error
            })
        }
        if (!usuarioBorrado) {
            return res.status(500).json({
                ok: false,
                mensaje: "No existe usuario con ese ID",
                errors: { message: "No existe usuario con ese ID" }
            })
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        })
    })
})


// =========================================

module.exports = app;