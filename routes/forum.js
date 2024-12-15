const express = require('express');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

// Mostrar todas las publicaciones
router.get('/', ensureAuthenticated, async (req, res) => {
  const posts = await prisma.post.findMany({ include: { user: true } });
  res.render('forum', { posts });
});

// Crear nueva publicación
router.post('/create', ensureAuthenticated, async (req, res) => {
  const { title, content } = req.body;
  await prisma.post.create({
    data: {
      title,
      content,
      userId: req.user.id,
    },
  });

  req.flash('success_msg', 'Publicación creada con éxito');
  res.redirect('/forum');
});

// Borrar publicación
router.get('/delete/:id', ensureAuthenticated, async (req, res) => {
  const postId = parseInt(req.params.id);
  const post = await prisma.post.findUnique({ where: { id: postId } });

  if (post.userId !== req.user.id) {
    req.flash('error_msg', 'No puedes borrar una publicación que no te pertenece');
    return res.redirect('/forum');
  }

  await prisma.post.delete({ where: { id: postId } });
  req.flash('success_msg', 'Publicación eliminada');
  res.redirect('/forum');
});

module.exports = router;
