const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.serializeUser(async (user, done) => {
	console.log('Сериализация: ', user);
  done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
	console.log('Десериализация: ', id);
  let user = await User.findById(id);
  done(null, user)
})

passport.use(new LocalStrategy((username, password, done) => {
		User.findOne({ username }).then(async function(user) {
			if (!user) {
				return done(null, false, { message: 'Неверный логин или пароль' });
			}
			let isMatch = await user.validPassword(password);
			if (!isMatch) {
				return done(null, false, { message: 'Неверный логин или пароль' });
			}
			return done(null, user);
		}).catch(function(err) {
			done(err);
		})
	}
));