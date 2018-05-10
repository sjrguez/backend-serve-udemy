// Requires

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')





// Inicializar variables

var app = express()

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE,OPTIONS");
    next();
});
// Body Parser

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Importar rutas

var imagenesRoute = require('./routes/imagenes')
var uploadRoute = require('./routes/upload')
var busquedaRoute = require('./routes/busqueda')
var medicoRoute = require('./routes/medico')
var hospitalRoute = require('./routes/hospital')
var usuarioRoute = require('./routes/usuario')
var appRoute = require('./routes/app')
var loginRoute = require('./routes/login')


// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB', (error, res) => {
    if (error) throw error
    console.log("Base de datos 3000: \x1b[32m%s\x1b[0m", " online");
})


// Sirve para ver las imagenes en la ruta
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));


// Rutas

app.use('/img', imagenesRoute)
app.use('/upload', uploadRoute)
app.use('/medico', medicoRoute)
app.use('/hospital', hospitalRoute)
app.use('/usuario', usuarioRoute)
app.use('/login', loginRoute)
app.use('/busqueda', busquedaRoute)


app.use('/', appRoute)

// Escuchar peticiones

app.listen(3000, () => {
    console.log("Express server puerto 3000: \x1b[32m%s\x1b[0m", " online");

})