const fs = require('fs')
const toys = require('../data/toy.json')
module.exports = {
  query,
  save,
  getById,
  remove,
}

function query(filterBy) {
  if (!toys) return
  const regex = new RegExp(filterBy.txt, 'i')
  let filteredToys = toys.filter((toy) => regex.test(toy.name))
  // if (filterBy.status === false) filteredToys = filteredToys.filter(toy => !toy.inStock);
  if (filterBy.sortBy) {
    switch (filterBy.sortBy) {
      case 'Name':
        filteredToys.sort((t1, t2) => t1.name.localeCompare(t2.name))
        break
      case 'Price':
        filteredToys.sort((t1, t2) => t1.price - t2.price)
        break
      case 'Time added':
        filteredToys.sort((t1, t2) => t1.createdAt - t2.createdAt)
        break
    }
  }
  return Promise.resolve(filteredToys)
}

function remove(toyId) {
  const idx = toys.findIndex((toy) => toy._id === toyId)
  toys.splice(idx, 1)
  return _saveToysToFile()
}

function save(toy) {
  if (toy._id) {
    const idx = toys.findIndex((currToy) => toy._id === currToy._id)
    toys[idx] = toy
  } else {
    toy._id = _makeId()
    toys.push(toy)
  }

  return _saveToysToFile().then(() => toy)
}

function getById(toyId) {
  const toy = toys.find((toy) => toy._id === toyId)
  return Promise.resolve(toy)
}

function _saveToysToFile() {
  return new Promise((resolve, reject) => {
    const content = JSON.stringify(toys, null, 2)
    fs.writeFile('./data/toy.json', content, (err) => {
      if (err) {
        console.error(err)
        return reject(err)
      }
      resolve()
    })
  })
}

function _makeId(length = 5) {
  var txt = ''
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return txt
}
