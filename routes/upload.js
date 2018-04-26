var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();
var fs = require('fs')

app.use(fileUpload());

// Modelos

var Usuario = require('../models/usuario')
var Medico = require('../models/medico')
var Hospital = require('../models/hospital')







app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo
    var id = req.params.id
        // Tipos de colecciones

    var tiposValidos = ['hospitales', 'medicos', 'usuarios']

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: "Tipo de coleccion no valida",
            errors: { message: "Los tipos de colecciones validas son " + tiposValidos.join(', ') }
        })
    }



    if (!req.files) {
        return res.status(500).json({
            ok: false,
            mensaje: "Error subiendo archivo",
            errors: { message: "Debe seleccionar imagen" }
        })

    }

    // Obtener nombre del archivo

    var archivo = req.files.imagen
    var nombreCortado = archivo.name.split('.');
    var extencionArchivo = nombreCortado[nombreCortado.length - 1]

    // Solo se aceptan estas extenciones

    var extencionesValidas = ['png', 'jpeg', 'jpg', 'gif'];
    if (extencionesValidas.indexOf(extencionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: "Extencion no validad",
            errors: { message: "Las extenciones validas son " + extencionesValidas.join(', ') }
        })
    }

    // Nombre del arrchivo
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencionArchivo}`

    //  Mover archivo ddel temporal al path
    var path = `./uploads/${ tipo }/${nombreArchivo}`
    archivo.mv(path, error => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al mover archivo",
                errors: error
            })
        }

    })
    subirPorTipo(tipo, id, nombreArchivo, res)
        // res.status(200).json({
        //     ok: true,
        //     mensaje: "Archivo movido",
        //     extencion: extencionArchivo

    // })

})


function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (error, usuario) => {
            var pathViejo = './usuarios/' + usuario.imagen
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo)
            }

            usuario.img = nombreArchivo

            usuario.save((error, usuarioActualizado) => {
                usuarioActualizado.password = ':)'
                return res.status(200).json({
                    ok: true,
                    mensaje: "Imagen de usuario actualizado",
                    usuario: usuarioActualizado

                })
            })


        })

    }


    if (tipo == 'medicos') {

        Medico.findById(id, (error, medico) => {
            var pathViejo = './medicos/' + medico.imagen
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo)
            }

            medico.img = nombreArchivo

            medico.save((error, medicoActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: "Imagen de medico actualizado",
                    medico: medicoActualizado

                })
            })


        })
    }

    if (tipo === 'hospitales') {

        Hospital.findById(id, (error, hospital) => {
            var pathViejo = './hospitales/' + hospital.imagen
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo)
            }

            hospital.img = nombreArchivo

            hospital.save((error, hospitalActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: "Imagen de hospital actualizado",
                    hospital: hospitalActualizado

                })
            })


        })
    }
}


module.exports = app;