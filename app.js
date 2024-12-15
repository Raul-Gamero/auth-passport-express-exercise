const express = require('express');
const PORT = process.env.PORT || 3000;
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const dotenv = require('dotenv');
const path = require('path');

const { engine } = require('express-handlebars');

// Configuración de variables de entorno
dotenv.config();
const app = express();

// Configuración de Handlebars como motor de vistas
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main', // Establece el layout por defecto
  layoutsDir: path.join(__dirname, 'views/layouts'), // Asegúrate de que 'views/layouts' es la ruta correcta
  helpers: {
    // Definir el helper "ifCond" para comparaciones
    ifCond: function (a, b, options) {
      if (a == b) {
        return options.fn(this); // Devuelve el bloque de código si la condición es verdadera
      }
      return options.inverse(this); // Devuelve el bloque de código "else" si la condición es falsa
    }
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares para manejo de datos
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configuración de sesiones
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Configuración de Passport
require('./utils/passportConfig')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Configuración de mensajes flash
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Importar y usar rutas desde el index.js de /routes
const routes = require('./routes');
app.use(routes);

// Importar rutas
const authRoutes = require('./routes/auth'); // Asegúrate de que el nombre y la ruta sean correctos
// Usar las rutas
app.use('/', authRoutes); // Ruta base para las rutas de autenticación

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
