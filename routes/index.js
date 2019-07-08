const Router = require('koa-router');
const router = new Router();
const path = require('path');
const send = require('koa-send');
// const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');

router.get('/api/getUsers', async (ctx) => {
  try {
    const result = await userController.getUsers();
    ctx.status = 200;
    ctx.body = result;
  } 
  catch (error) {
    console.error("error", error);
    ctx.status = error.code || 500;
    ctx.body = {message: error.message, code: error.code};
  }
});

router.post('/api/saveNewUser', async (ctx) => {
  try {
    const result = await userController.saveNewUser(ctx.request.body);
    ctx.body = result;
  } 
  catch (error) {
    console.error("error", error);
    ctx.status = error.code || 500;
    ctx.body = {message: error.message, code: error.code};
  }
});

router.put('/api/updateUser/:id', async (ctx) => {
  try {
    const result = await userController.updateUser(ctx);
    ctx.body = result;
  } 
  catch (error) {
    console.error("error", error);
    ctx.status = error.code || 500;
    ctx.body = {message: error.message, code: error.code};
  }
});

router.post('/api/saveUserImage/:id', async (ctx) => {
  try {
    const result = await userController.saveUserImage(ctx);
    ctx.body = result;
  } 
  catch (error) {
    console.error("error", error);
    ctx.status = error.code || 500;
    ctx.body = {message: error.message, code: error.code};
  }
});

router.delete('/api/deleteUser/:id', async (ctx) => {
  try {
    const result = await userController.deleteUser(ctx);
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
    ctx.status = 200;
    ctx.body = result;
  } 
  catch (error) {
    console.error("error", error);
    ctx.status = error.code || 500;
    ctx.body = {message: error.message, code: error.code};
  }
});

router.get('*', async (ctx) => {
  await send(ctx, path.join('public', 'index.html'));
})

module.exports = router;