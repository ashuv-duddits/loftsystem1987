const User = require('./models/user');
const Permission = require('./models/permission');
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');

const resultConverter = async (item) => {
  const permission = await Permission.findById(item.permissionId);
  return {
    access_token: item.access_token,
    id: item.id,
    username: item.username,
    password: item.password,
    firstName: item.firstName,
    middleName: item.middleName,
    surName: item.surName,
    image: item.image,
    permission: {
      chat: permission.chat,
      news: permission.news,
      setting: permission.setting,
    },
    permissionId: item.permissionId
  }
}

const createAdmin = () => new Promise(async (resolve, reject) => {
  try {
    const newPermission = new Permission({
      chat: {
        C: true,
        D: true,
        R: true,
        U: true
      },
      news: {
        C: true,
        D: true,
        R: true,
        U: true
      },
      setting: {
        C: true,
        D: true,
        R: true,
        U: true
      }
    })
    const permission = await newPermission.save();

    let hash = await bcrypt.hash('admin', 10);
    let access_token = uuidv4();
    const newUser = new User({
      username: 'admin',
      firstName: 'Админ',
      middleName: 'Админов',
      surName: 'Админович',
      password: hash,
      image: "\\upload\\admin.png",
      permissionId: permission.id,
      access_token: access_token
    })
    const result = await newUser.save();

    Promise.resolve(resultConverter(result)).then(function(user) {
      resolve(user);
    })
  }
  catch (error) {
    reject({
      message: error.message
    });
  }
})


createAdmin().then(function(user) {
  console.log('Вы создали администратора, можете авторизоваться логин:',user.username,' пароль: admin');
}, function(error) {
  console.log('Ошибка: ', error.message);
})


