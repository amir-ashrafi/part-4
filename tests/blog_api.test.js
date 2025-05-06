const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert/strict')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

let token

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'testuser', passwordHash })
  await user.save()

  const userForToken = {
    username: user.username,
    id: user._id
  }

  token = jwt.sign(userForToken, process.env.SECRET)

  await Blog.deleteMany({})
  const initialBlogs = [
    {
      title: 'Test Blog 1',
      author: 'Test Author',
      url: 'http://example.com/1',
      likes: 5,
      user: user._id
    },
    {
      title: 'Test Blog 2',
      author: 'Test Author',
      url: 'http://example.com/2',
      likes: 7,
      user: user._id
    }
  ]

  const blogObjects = initialBlogs.map(blog => new Blog(blog))
  await Promise.all(blogObjects.map(blog => blog.save()))
})

test('GET /api/blogs - blogs are returned as json and the correct number of blogs is returned', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, 2)
})

test('GET /api/blogs - blog posts have an id property', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach(blog => {
    assert.ok(blog.id, 'Blog is missing "id" property')
  })
})

test('POST /api/blogs - should create a new blog post and increase the total number of blogs by one', async () => {
  const blogsAtStart = await Blog.find({})

  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 0
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({})
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

  const titles = blogsAtEnd.map(blog => blog.title)
  assert.ok(titles.includes(newBlog.title))
})

test('POST /api/blogs - should default likes to 0 if missing from the request', async () => {
  const newBlog = {
    title: 'Test Blog with No Likes',
    author: 'Test Author',
    url: 'http://test.com'
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('POST /api/blogs - returns 400 Bad Request if title and/or url is missing', async () => {
  const newBlogMissingTitle = {
    author: 'Test Author',
    url: 'http://test.com',
    likes: 5
  }

  const newBlogMissingUrl = {
    title: 'Test Blog without URL',
    author: 'Test Author',
    likes: 10
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlogMissingTitle)
    .expect(400)

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlogMissingUrl)
    .expect(400)
})

test('DELETE /api/blogs/:id - deletes a blog post', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await Blog.find({})
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
  assert.ok(!blogsAtEnd.map(b => b.id).includes(blogToDelete.id))
})

test('PUT /api/blogs/:id - updates the likes of a blog post', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToUpdate = blogsAtStart[0]

  const updatedData = {
    ...blogToUpdate.toJSON(),
    likes: blogToUpdate.likes + 10
  }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, blogToUpdate.likes + 10)
})

test('a valid blog can be added with valid token', async () => {
  const newBlog = {
    title: 'A blog with token',
    author: 'Author',
    url: 'http://someurl.com',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
})

test('adding a blog fails with status 401 if token is not provided', async () => {
  const newBlog = {
    title: 'No token blog',
    author: 'Anonymous',
    url: 'http://no-token.com',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

after(async () => {
  await mongoose.connection.close()
})
