const express = require('express')
const blogsRouter = express.Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const userExtractor = require('../middleware/userExtractor')
blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/',userExtractor, async (req, res) => {
  const { title, url, likes, author } = req.body

  if (!title || !url) {
    return res.status(400).json({ error: 'Title or url missing' })
  }
  let decodedToken
  try {
    decodedToken = jwt.verify(req.token, process.env.SECRET)
  } catch (err) {
    return res.status(401).json({ error: 'token missing or invalid 1' })
  }

  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)
  if (!user) {
    return res.status(401).json({ error: 'user not found' })
  }

  const blog = new Blog({
    title,
    url,
    likes: likes || 0,
    author,
    user: user._id
  })

  try {
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    const populatedBlog = await Blog.findById(savedBlog._id).populate('user', {
      username: 1,
      name: 1
    })

    res.status(201).json(populatedBlog)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})
blogsRouter.delete('/:id',userExtractor, async (req, res) => {
  const token = req.token

  let decodedToken
  try {
    decodedToken = jwt.verify(token, process.env.SECRET)
  } catch (err) {
    return res.status(401).json({ error: 'token missing or invalid 1' })
  }

  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  const userId = decodedToken.id
  const blogId = req.params.id

  try {
    const blog = await Blog.findById(blogId)

    if (!blog) {
      return res.status(404).json({ error: 'blog not found' })
    }

    if (blog.user.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'unauthorized: you can only delete your own blogs' })
    }

    await Blog.findByIdAndDelete(blogId)

    const user = await User.findById(userId)
    user.blogs = user.blogs.filter(b => b.toString() !== blogId)
    await user.save()

    res.status(204).end()
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

blogsRouter.put('/:id', async (req, res) => {
  const { title, author, url, likes } = req.body

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, author, url, likes },
      { new: true, runValidators: true, context: 'query' }
    )
    res.json(updatedBlog)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})
blogsRouter.post('/:id/comments', async (req, res, next) => {
  try {
    const { comment } = req.body
    const blog = await Blog.findById(req.params.id)
    if (!blog) {
      return res.status(404).json({ error: 'blog not found' })
    }
    blog.comments = blog.comments.concat(comment)
    const updatedBlog = await blog.save()
    res.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})
module.exports = blogsRouter
