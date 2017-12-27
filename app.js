const express = require('express');
const path = require('path'); // para poder acceder archivos estáticos en la carpeta public (css, js)
const exphbs  = require('express-handlebars'); 
const requestify = require('requestify');
const bodyParser = require('body-parser');

//cargando rutas
const indexRoutes = require('./routes/index');

const app = express();

const port = proccess.env.PORT || 3000;


// HELPERS HANDLEBARS
const {
  dificultad,
  dificultadClass
} = require ('./helpers/hbs');

// MIDDLEWARE

// middleware body parser -- Ahora se puede acceder a req.body.title o cosas así
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

// Middleware handlebars -- para usar template engines
app.engine('handlebars', exphbs({
  helpers : {
    dificultad : dificultad,
    dificultadClass : dificultadClass
  },
  defaultLayout: 'main' // main sera el layout por defecto para todas las vistas
}));
app.set('view engine', 'handlebars');

// Middleware path -- para acceder a archivos estáticos en la carpeta public
app.use(express.static(path.join(__dirname, 'public')));


//usando rutas
app.use('/',indexRoutes);


app.listen(port, () => {
  console.log(`Server started. Go to http://localhost:${port}`);
})