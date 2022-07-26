const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy) {
  try {
    const criteria = _buildCriteria(JSON.parse(filterBy))
    const collection = await dbService.getCollection('board')
    return collection.find(criteria).toArray()
  } catch (err) {
    logger.error('cannot find boards', err)
    throw err
  }
}

async function getById(boardId) {
  try {
    const collection = await dbService.getCollection('board')
    const board = collection.findOne({ _id: ObjectId(boardId) })
    return board
  } catch (err) {
    logger.error(`while finding board ${boardId}`, err)
    throw err
  }
}

async function remove(boardId) {
  try {
    const collection = await dbService.getCollection('board')
    await collection.deleteOne({ _id: ObjectId(boardId) })
    return boardId
  } catch (err) {
    logger.error(`cannot remove board ${boardId}`, err)
    throw err
  }
}

async function add(board) {
  try {
    const collection = await dbService.getCollection('board')
    const addedBoard = await collection.insertOne(board)
    return addedBoard.insertedId
  } catch (err) {
    logger.error('cannot insert board', err)
    throw err
  }
}

async function q(board) {
  try {
    const collection = await dbService.getCollection('board')
    const qedBoard = await collection.insertOne(board)
    return qedBoard
  } catch (err) {
    logger.error('cannot insert board', err)
    throw err
  }
}
async function update(board) {
  try {
    var id = ObjectId(board._id)
    delete board._id
    const collection = await dbService.getCollection('board')
    await collection.updateOne({ _id: id }, { $set: { ...board } })
    board._id = id
    return board
  } catch (err) {
    logger.error(`cannot update board ${boardId}`, err)
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
    txt: ''
  }
) {
  const criteria = {}
  if (filterBy.txt) {
    var regex = new RegExp(filterBy.txt, 'i')
    criteria.title = { $regex: regex }
  }
  return criteria
}