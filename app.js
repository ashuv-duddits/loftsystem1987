require('dotenv').config();
const path = require('path'),
  fs = require('fs'),
  Koa = require('koa'),
  static = require('koa-static'),
  session = require("koa-session"),
  convert = require('koa-convert'),
  koaBody = convert(require('koa-body'));
  
  
const config = require('./config.json');

const app = new Koa();

// подключение к БД mongodb
config.db.host = process.env.DB_HOST;
config.db.port = process.env.DB_PORT;
config.db.name = process.env.DB_NAME;
config.db.user = process.env.DB_USER;
config.db.password = process.env.DB_PASS;

require('./db');

app.keys = ['secret'];
app.use(session({
  key: 'koa:sess',
  maxAge: 60*60*1000,
  autoCommit: true,
  overwrite: true, 
  httpOnly: true, 
  signed: true, 
  rolling: false, 
  renew: false,
}, app));

app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, 'public', 'upload')
  }
}));

app.use(static(path.join(__dirname, 'public')));

require('./services/config-passport');

const passport = require('koa-passport');
app.use(passport.initialize());
app.use(passport.session());


const router = require('./routes');
app.use(router.routes());
app.use(router.allowedMethods());

// app.use(async (ctx, next) => {
//   try {
//     await next();
//     let err = new Error('Not found');
//     err.status = 404;
//     ctx.app.emit('error', err, ctx);
//   } catch (err) {
//     ctx.app.emit('error', err, ctx);
//   }
// })

// app.on('error', (err, ctx) => {
//   ctx.status = err.status || 500;
//   // ctx.render('error', {message: err.message, error: err})
// });

app.listen(process.env.PORT, function(err) {
  if (err) {
    return console.log(err);
  }

  if (!fs.existsSync(path.join(__dirname, 'public', 'upload'))) {
    fs.mkdirSync(path.join(__dirname, 'public', 'upload'));
  }
  console.log('Сервер запущен на порту: ', process.env.PORT)
})