import express from 'express';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res, next) => {
  try {
    let user = null;

    if (req.user) {
      user = await prisma.users.findUnique({
        where: { username: req.user.username },
        include: { files: true },
      });
    }

    res.render('index', { user: req.user, files: user ? user.files : [] });
  } catch (err) {
    next(err);
  }
});

router.get('/sign-up', (req, res) => res.render('sign-up-form'));

router.post('/sign-up', async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await prisma.users.create({
      data: {
        username: req.body.username,
        password: hashedPassword,
      },
    });

    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post(
  '/log-in',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
  })
);

router.get('/delete/:index', async (req, res) => {
  const id = parseInt(req.params.index);
  try {
    await prisma.file_Storage.delete({
      where: { id: id },
    });
    res.redirect('/');
  } catch (err) {
    console.error('Error deleting game:', err);
    res.status(500).send('Server Error');
  }
});

router.get('/log-out', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

router.get('/storefile', (req, res) => {
  render('storefile');
});

router.post('/storefile', upload.single('userfile'), async (req, res, next) => {
  try {
    const filePath = req.file.path;
    const userId = req.user.id;

    await prisma.file_Storage.create({
      data: {
        content: filePath,
        authorId: userId,
      },
    });
    res.send('File uploaded successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).send('server Error');
  }
});

export default router;
