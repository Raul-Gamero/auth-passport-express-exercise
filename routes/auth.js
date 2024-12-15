const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

// Ruta GET para mostrar el formulario de registro
router.get('/register', (req, res) => {
  res.render('register', { title: 'Registro' });
});

// Ruta POST para registrar un nuevo usuario
router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Verificar si las contraseñas coinciden
  if (password !== confirmPassword) {
    req.flash('error_msg', 'Las contraseñas no coinciden');
    return res.redirect('/register');
  }

  // Verificar si el correo electrónico ya está registrado
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    req.flash('error_msg', 'El correo electrónico ya está registrado');
    return res.redirect('/register');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    req.flash('success_msg', 'Te has registrado exitosamente, ahora puedes iniciar sesión');
    res.redirect('/login');
  } catch (err) {
    req.flash('error_msg', 'Error al registrar el usuario');
    res.redirect('/register');
  }
});

// Ruta GET para mostrar el formulario de login
router.get('/login', (req, res) => {
  res.render('login', { title: 'Iniciar sesión' });
});

// Ruta POST para manejar el login con Passport
router.post('/login', passport.authenticate('local', {
  successRedirect: '/forum',
  failureRedirect: '/login',
  failureFlash: true,
}));

// Ruta GET para cerrar sesión
router.get('/logout', (req, res) => {
  req.logout(() => {
    req.flash('success_msg', 'Has cerrado sesión exitosamente');
    res.redirect('/login');
  });
});

module.exports = router;
