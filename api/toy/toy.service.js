const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy) {
  try {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('toy')
    if (criteria.sort.by) {
      let sortCriteria
      const { direction } = criteria.sort
      switch (criteria.sort.by) {
        case 'name':
          sortCriteria = { name: direction }
          break
        case 'price':
          sortCriteria = { price: direction }
          break
        case 'created':
          sortCriteria = { createdAt: direction }
          break
      }
      toys = await collection.find(criteria.filter).sort(sortCriteria).toArray()
    } else toys = await collection.find(criteria.filter).toArray()
    return toys
  } catch (err) {
    logger.error('cannot find toys', err)
    throw err
  }
}

async function getById(toyId) {
  try {
    const collection = await dbService.getCollection('toy')
    const toy = collection.findOne({ _id: ObjectId(toyId) })
    return toy
  } catch (err) {
    logger.error(`while finding toy ${toyId}`, err)
    throw err
  }
}

async function remove(toyId) {
  try {
    const collection = await dbService.getCollection('toy')
    await collection.deleteOne({ _id: ObjectId(toyId) })
    return toyId
  } catch (err) {
    logger.error(`cannot remove toy ${toyId}`, err)
    throw err
  }
}

async function add(toy) {
  try {
    const collection = await dbService.getCollection('toy')
    const addedToy = await collection.insertOne(toy)
    return addedToy.insertedId
  } catch (err) {
    logger.error('cannot insert toy', err)
    throw err
  }
}

async function q(toy) {
  try {
    const collection = await dbService.getCollection('toy')
    const qedToy = await collection.insertOne(toy)
    return qedToy
  } catch (err) {
    logger.error('cannot insert toy', err)
    throw err
  }
}
async function update(toy) {
  try {
    var id = ObjectId(toy._id)
    delete toy._id
    const collection = await dbService.getCollection('toy')
    await collection.updateOne({ _id: id }, { $set: { ...toy } })
    return toy
  } catch (err) {
    logger.error(`cannot update toy ${toyId}`, err)
    throw err
  }
}

module.exports = {
  remove,
  query,
  getById,
  q,
  update,
  add,
}

function _buildCriteria(
  filterBy = {
    txt: '',
    status: true,
    sort: {
      by: '',
      direction: 1,
    },
  }
) {
  const criteria = { filter: {}, sort: {} }
  if (filterBy.status !== undefined) criteria.filter.inStock = JSON.parse(filterBy.status)
  if (filterBy.txt) {
    var regex = new RegExp(filterBy.txt, 'i')
    criteria.filter.name = { $regex: regex }
  }
  filterBy.sort = JSON.parse(filterBy.sort)
  if (filterBy.sort.by) {
    criteria.sort.by = filterBy.sort.by
    criteria.sort.direction = -filterBy.sort.direction
  }
  return criteria
}
