const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const app = express()
const userExtractor = require('./middleware/userExtractor')
const tokenExtractor  = require('./middleware/tokenExtractor')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
mongoose.connect(config.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error.message))
  

app.use(express.json())

app.use(tokenExtractor)
app.use('/api/login', loginRouter)
app.use('/api/blogs',blogsRouter)
app.use('/api/users', usersRouter)
module.exports = app
