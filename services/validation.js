const validation = function(id, files) {

  if (files[id].name === '' || files[id].size === 0) {
    return {status: 'Не загружена картинка!', err: true}
  }

  return {status: 'Ок', err: false}
}

module.exports = validation;