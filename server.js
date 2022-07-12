const toyService = require('./services/toy.service')

const express = require('express')
// const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()

app.use(express.static('public'))
// app.use(cookieParser())
app.use(express.json())
app.use(cors())

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server is ready at port: ${port}`))

//LIST
app.get('/api/toy', (req, res) => {
  const { txt, status, sortBy } = req.query
  const filterBy = {
    txt,
    status,
    sortBy,
  }
  toyService
    .query(filterBy)
    .then((toys) => res.send(toys))
    .catch((err) => res.status(404).send("Couldn't get toys"))
})

//CREATE
app.post('/api/toy', (req, res) => {
  const {name, price, inStock, createdAt, labels } = req.body
  const toy = {name, price, inStock, createdAt, labels }
  toyService
    .save(toy)
    .then((toy) => {
      res.send(toy)
    })
    .catch((err) => res.status(401).send("Couldn't save toy"))
})

//UPDATE
app.put('/api/toy/:toyId', (req, res) => {
  const { _id, name, price, inStock, createdAt, labels } = req.body
  const toy = { _id, name, price, inStock, createdAt, labels }
  toyService
    .save(toy)
    .then((savedToy) => res.send(savedToy))
    .catch((err) => res.status(401).send("Couldn't save toy"))
})

//DELETE
app.delete('/api/toy/:toyId', (req, res) => {
  const { toyId } = req.params
  toyService.getById(toyId).then((toy) => {
    toyService
      .remove(toyId)
      .then(() => {
        res.send('Removed!')
      })
      .catch(() => res.send('Error occurd while removing'))
  })
})

//GET
app.get('/api/toy/:toyId', (req, res) => {
  const { toyId } = req.params
  toyService
    .getById(toyId)
    .then((toy) => res.send(toy))
    .catch((err) => err.status(404).send("Couldn't find toy"))
})

