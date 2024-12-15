const express = require('express');
const router = express.Router();

// Importar las rutas específicas
const authRoutes = require('./auth');
const forumRoutes = require('./forum');

// Usar las rutas con sus respectivos prefijos
router.use('/auth', authRoutes); // Rutas de autenticación
router.use('/forum', forumRoutes); // Rutas del foro

// Ruta base (opcional, redirige a login o foro)
router.get('/', (req, res) => {
  res.redirect('/auth/login');
});

module.exports = router;
