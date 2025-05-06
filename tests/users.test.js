const { test, beforeEach } = require('node:test')
const assert = require('node:assert/strict')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', name: 'Superuser', passwordHash })

  await user.save()
})

test('fails if username is less than 3 characters', async () => {
  const newUser = {
    username: 'ab',
    name: 'Short Username',
    password: 'validpass'
  }

  const response = await api.post('/api/users').send(newUser).expect(400)
  assert.match(response.body.error, /at least 3 characters/)
})

test('fails if password is less than 3 characters', async () => {
  const newUser = {
    username: 'validuser',
    name: 'Short Password',
    password: 'pw'
  }

  const response = await api.post('/api/users').send(newUser).expect(400)
  assert.match(response.body.error, /at least 3 characters/)
})

test('fails if username already exists', async () => {
  const newUser = {
    username: 'root',
    name: 'Duplicate User',
    password: 'anotherpass'
  }

  const response = await api.post('/api/users').send(newUser).expect(400)
  assert.match(response.body.error, /username must be unique/)
})
