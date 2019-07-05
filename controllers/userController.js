const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('koa-passport');

const resultConverter = (item) => {
  return {
    access_token: "dadas141414",
    id: item.id,
    username: item.username,
    password: item.password,
    firstName: item.firstName,
    middleName: item.middleName,
    surName: item.surName,
    image: "",
    permission: {
      chat: {
        C: false,
        D: false,
        R: false,
        U: false
      },
      news: {
        C: false,
        D: false,
        R: false,
        U: false
      },
      setting: {
        C: false,
        D: false,
        R: false,
        U: false
      }
    },
    permissionId: ""
  }
}

exports.getUsers = () => new Promise(async (resolve, reject) => {
  try {
    let result = await User.find();
    resolve(result.map((item) => resultConverter(item)))
  }
  catch (err) {
    reject({
      message: err.message,
      code: 500
    });
  }
})

exports.saveNewUser = ({ username, firstName, middleName, surName, password }) => new Promise(async (resolve, reject) => {
  try {
    let hash = await bcrypt.hash(password, 10);
    const newUser = new User({
      username, firstName, middleName, surName, password: hash
    })
    const result = await newUser.save();
    resolve(resultConverter(result));
  }
  catch (error) {
    reject({
      message: error.message,
      code: 500
    });
  }
})

exports.login = (ctx) => new Promise(async (resolve, reject) => {
  try {
    await passport.authenticate('local', async (err, user) => {
      if (err) {
        reject({
          message: err.message,
          code: 500
        });
      }
      if(!user){
        reject({
          message: "Неверный логин или пароль",
          code: 401
        });
      } else {
        ctx.login(user, async (err) => {
          if (err) {
            reject({
              message: err.message,
              code: 500
            });
          }
          resolve(resultConverter(user));
        });
      }
    })(ctx)
  }
  catch (error) {
    reject({
      message: error.message,
      code: 500
    });
  }
})

