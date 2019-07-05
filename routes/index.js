const Router = require('koa-router');
const router = new Router();
const path = require('path');
const send = require('koa-send');
// const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');

router.get('/getUsers', async (ctx) => {
  try {
    const result = await userController.getUsers();
    ctx.toJSON({data: result})
  } 
  catch (error) {
    console.error("error", error);
    ctx.status = error.code || 500;
    ctx.toJSON({message: error.message, code: error.code});
  }
});

router.post('/api/saveNewUser', async (ctx) => {
  try {
    const result = await userController.saveNewUser(JSON.parse(ctx.request.body));
    ctx.body = result;
  } 
  catch (error) {
    console.error("error", error);
    ctx.status = error.code || 500;
    ctx.body = {message: error.message, code: error.code};
  }
});

router.post('/api/login', async (ctx) => {
  try {
    const result = await userController.login(ctx);
    ctx.body = result;
  } 
  catch (error) {
    console.error("error", error);
    ctx.status = error.code || 500;
    ctx.body = {message: error.message, code: error.code};
  }
});

router.get('*', async (ctx) => {
  await send(ctx, path.join(__dirname, 'public', 'index.html'));
})

module.exports = router;