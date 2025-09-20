import { PrismaClient } from '@prisma/client';
import { render } from 'ejs';

const prisma = new PrismaClient();
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  res.render('main');
});

module.exports = router;
