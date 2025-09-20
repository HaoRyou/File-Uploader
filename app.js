import express from 'express';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

import path from 'node:path';
import { fileURLToPath } from 'node:url'; // ⬅ for __dirname replacement
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import indexRouter from './routers/main.js'; // ⬅ replace require with import

// Prisma client
const prisma = new PrismaClient();

// ESM replacement for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Passport local strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.Users.findUnique({
        where: { username },
      });

      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.Users.findUnique({
      where: { id },
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const app = express();

// Views setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(
  session({ secret: 'HaoAreYou', resave: false, saveUninitialized: false })
);

app.use(passport.initialize()); // ⬅ you were missing this line
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

async function printAllUsers() {
  try {
    const users = await prisma.users.findMany();
    console.log('All users:', users);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

printAllUsers();

// Routers
app.use('/', indexRouter);

const PORT = 3000;
app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`File Uploader - listening on port ${PORT}!`);
});
