require('dotenv').config();
const path = require('path'),
  fs = require('fs'),
  Koa = require('koa'),
  static = require('koa-static'),
  session = require("koa-session"),
  convert = require('koa-convert'),
  koaBody = convert(require('koa-body'));

const User = require('./models/user');
  
const config = require('./config.json');

const app = new Koa();

const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);

const clients = {};

io.on('connection', async function(socket){
  console.log('connected')
  const user = await User.findOne({username: socket.handshake.headers['username']});
  const id = user.id;
  clients[id] = {id: socket.id, username: user.username}
  console.log(clients);

  socket.emit('all users', clients);

  socket.broadcast.emit('new user', clients[id]);

  socket.on('chat message', (message, socketId) => {
    socket.to(socketId).emit('chat message', message, clients[id].id);
  }); 

  socket.on('disconnect', () => {
    socket.broadcast.emit('delete user', clients[id].id);
    delete clients[id];
    socket.emit('all users', clients);
  });
});

// подключение к БД mongodb
config.db.host = process.env.MLAB_DB_HOST;
config.db.port = process.env.MLAB_DB_PORT;
config.db.name = process.env.MLAB_DB_NAME;
config.db.user = process.env.MLAB_DB_USER;
config.db.password = process.env.MLAB_DB_PASS;


require('./db');

app.keys = ['secret'];
app.use(session({}, app));

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

server.listen(process.env.PORT, function(err) {
  if (err) {
    return console.log(err);
  }
  setTimeout(async function() {
    let existsAdmin = await User.findOne({username: 'admin'});
    if (!existsAdmin) {
      require('./install');
    }
  }, 3000)

  if (!fs.existsSync(path.join(__dirname, 'public', 'upload'))) {
    fs.mkdirSync(path.join(__dirname, 'public', 'upload'));
  }
  console.log('Сервер запущен на порту: ', process.env.PORT)
})