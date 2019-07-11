const New = require('../models/new');
const User = require('../models/user');

const resultConverter = async (item) => {
  const user = await User.findById(item.userId);
  return {
    id: item.id,
    text: item.text,
    theme: item.theme,
    date: item.date,
    user: user
  }
}

exports.getNews = () => new Promise(async (resolve, reject) => {
  try {
    let news = await New.find();
    Promise.all(news.map((item) => resultConverter(item))).then(function(results) {
      resolve(results);
    })
  }
  catch (err) {
    reject({
      message: err.message,
      code: 500
    });
  }
})

exports.newNews = ({ userId, text, theme, date }) => new Promise(async (resolve, reject) => {
  try {
    const newNew = new New({
      userId, text, theme, date
    })
    await newNew.save();
    const news = await New.find();
    Promise.all(news.map((item) => resultConverter(item))).then(function(results) {
      resolve(results);
    })
  }
  catch (error) {
    reject({
      message: error.message,
      code: 500
    });
  }
})

exports.updateNews = (ctx) => new Promise(async (resolve, reject) => {
  try {
    await New.updateOne({_id: ctx.params.id}, {text: ctx.request.body.text, theme: ctx.request.body.theme, date: ctx.request.body.date});
    const news = await New.find();
    Promise.all(news.map((item) => resultConverter(item))).then(function(results) {
      resolve(results);
    })
  }
  catch (error) {
    reject({
      message: error.message,
      code: 500
    });
  }
})

exports.deleteNews = (ctx) => new Promise(async (resolve, reject) => {
  try {
    await New.deleteOne({_id: ctx.params.id});
    const news = await New.find();
    Promise.all(news.map((item) => resultConverter(item))).then(function(results) {
      resolve(results);
    })
  }
  catch (error) {
    reject({
      message: error.message,
      code: 500
    });
  }
})