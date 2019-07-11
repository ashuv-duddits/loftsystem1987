const Permission = require('../models/permission');

exports.updateUserPermission = (ctx) => new Promise(async (resolve, reject) => {
  try {
    const currentPermission = await Permission.findById(ctx.params.id);
    const updatePermission = {};
    let chat = 0;
    let news = 0;
    let setting = 0;
    Object.keys(ctx.request.body.permission).forEach(function(key){
      if (key == 'chat') {
        chat++;
      }
      if (key == 'news') {
        news++;
      }
      if (key == 'setting') {
        setting++;
      }
      if (key == 'chat' || key == 'news' || key == 'setting') {
        updatePermission[key] = ctx.request.body.permission[key];
        let c = 0;
        let r = 0;
        let u = 0;
        let d = 0;
        Object.keys(updatePermission[key]).forEach(function(i) {
          if (i == 'C') {
            c++;
          }
          if (i == 'R') {
            r++;
          }
          if (i == 'U') {
            u++;
          }
          if (i == 'D') {
            d++;
          }
        })
        if (c == 0) {
          updatePermission[key]['C'] = currentPermission[key]['C'];
        }
        if (r == 0) {
          updatePermission[key]['R'] = currentPermission[key]['R'];
        }
        if (u == 0) {
          updatePermission[key]['U'] = currentPermission[key]['U'];
        }
        if (d == 0) {
          updatePermission[key]['D'] = currentPermission[key]['D'];
        }
      }
    })
    if (chat == 0) {
      updatePermission['chat'] = currentPermission['chat'];
    }
    if (news == 0) {
      updatePermission['news'] = currentPermission['news'];
    }
    if (setting == 0) {
      updatePermission['setting'] = currentPermission['setting'];
    }
    await Permission.updateOne(
      { 
        _id: ctx.params.id
      },
      { 
        chat: updatePermission.chat,
        news: updatePermission.news,
        setting: updatePermission.setting,
      }
    );
    const permission = await Permission.findById(ctx.params.id);
    resolve(permission);
  }
  catch (error) {
    reject({
      message: error.message,
      code: 500
    });
  }
})