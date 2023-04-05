import passport from 'passport';
import expressSession from 'express-session';
import LocalStrategy from 'passport-local';
import { createHash } from 'crypto';
import { get } from './User/model.js';

export default function (app) {
  //Umwandlung eines Objekt in einen Bytestrom
  passport.serializeUser((user, done) => done(null, user.id));

  // Umwandlung eines Bytestroms in ein Objekt
  passport.deserializeUser(async (id, done) => {
    const user = await get({ id }); // Mit der id kann hier ein User ermittelt werden!
    if (!user) {
      done('User not found');
    } else {
      done(null, user);
    }
  });

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const hash = createHash('md5').update(password).digest('hex');
      const user = await get({ username, password: hash });
      if (!user) {
        done(null, false);
      } else {
        done(null, user);
      }
    })
  );

  app.use(
    expressSession({
      secret: 'M151',
      resave: false,
      saveUninitialized: false,
      //cookie: { secure: true },
    })
  );

  app.use(passport.initialize());

  app.use(passport.session());

  app.post(
    '/login',
    passport.authenticate('local', { failureRedirect: '/login.html' }),
    (request, response) => {
      response.redirect('/');
    }
  );

  app.get('/logout', (request, response, next) => {
    request.logout(function (err) {
      if (err) {
        return next(err);
      }
      response.redirect('/');
    });
  });
}
