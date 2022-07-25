const express = require('express')
const { requireAuth} = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getBoards, getBoardById, addBoard, updateBoard, removeBoard} = require('./board.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', requireAuth, getBoards)
router.get('/:id', requireAuth, getBoardById)
router.post('/', requireAuth, addBoard)
router.put('/:id', requireAuth, updateBoard)
router.delete('/:id', requireAuth, removeBoard)

module.exports = router