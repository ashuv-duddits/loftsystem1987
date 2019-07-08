const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('koa-passport');
const validation = require('../services/validation');
const fs = require('fs');
const path = require('path');

const resultConverter = (item) => {
  return {
    access_token: "dadas141414",
    id: item.id,
    username: item.username,
    password: item.password,
    firstName: item.firstName,
    middleName: item.middleName,
    surName: item.surName,
    image: item.image,
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
      username, firstName, middleName, surName, password: hash, image: ""
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

exports.deleteUser = (ctx) => new Promise(async (resolve, reject) => {
  try {
    const result = await User.deleteOne({_id: ctx.params.id});
    resolve(resultConverter(result));
  }
  catch (error) {
    reject({
      message: error.message,
      code: 500
    });
  }
})

exports.updateUser = (ctx) => new Promise(async (resolve, reject) => {
  try {
    let comparePassword = () => new Promise(function(resolve, reject) {
      let isOldPassword = false;
      Object.keys(ctx.request.body).forEach(function(key) {
        if (key == 'oldPassword') {
          isOldPassword= true;
          User.findById(ctx.params.id).then(async function(user) {
            let isMatch = await user.validPassword(ctx.request.body[key]);
            if (isMatch) {
              let hash = await bcrypt.hash(ctx.request.body.password, 10);
              await User.updateOne({_id: ctx.params.id}, {password: hash});
              resolve();
            }
          })
        }
      })
      if(!isOldPassword) {
        resolve();
      }
    })
    await comparePassword();
    let updateObject = ctx.request.body;
    Object.keys(updateObject).forEach(function(key) {
      if (key == 'password' || key == 'oldPassword' || key == 'image') {
        delete updateObject[key];
      }
    })
    await User.updateOne({_id: ctx.params.id}, updateObject);
    const user = await User.findById(ctx.params.id);
    resolve(resultConverter(user));
  }
  catch (error) {
    reject({
      message: error.message,
      code: 500
    });
  }
})

exports.saveUserImage = (ctx) => new Promise(async (resolve, reject) => {
  try {
    let files = ctx.request.files;
    let id = ctx.params.id;
    let valid = validation(id, files);
    console.log('valid=', valid);
    if (valid.err) {
      if (files[id].path) {
        fs.unlinkSync(files[id].path);
      }
      reject({
        message: valid.status,
        code: 500
      });
    }
    let rename = function(oldPath, newPath) {
      return new Promise(function(resolve, reject) {
        fs.rename(oldPath, newPath, async function (err) {
          if (err) {
            reject({
              message: err.message,
              code: 500
            });
          }
          console.log('Rename completed!');
  
          let dir = path.normalize(newPath.substr(newPath.indexOf('\\')));
          await User.updateOne({_id: id}, {image: dir});
          let newUser = await User.findById(id);
          resolve(newUser);
        })
      })
    }

    const fileName = path.join('./public', 'upload', files[id].name);
    if (files[id].path) {
      let user = await rename(files[id].path, fileName);
      resolve(resultConverter(user));
    }
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
    console.log(ctx.request.body)
    await passport.authenticate('local', async (err, user, info) => {
      if (err) {
        reject({
          message: err.message,
          code: 500
        });
      }
      if(!user){
        reject({
          message: info.message,
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

