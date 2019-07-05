const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.serializeUser(async (user, done) => {
	console.log('Сериализация: ', user);
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
	console.log('Десериализация: ', id);
  let user = await User.findById(id);
  done(null, user)
})



passport.use(new LocalStrategy((username, password, done) => {
		console.log('data', username, password);
		User.find({ username: username }, function (err, user) {
			if (err) { return done(err); }
			if (!user) {
				return done(null, false, { message: 'Incorrect username.' });
			}
			if (!user.validPassword(password)) {
				return done(null, false, { message: 'Incorrect password.' });
			}
			return done(null, user);
		});
	}
));