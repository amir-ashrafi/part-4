const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('dummy function', () => {
  test('dummy returns one', () => {
    const blogs = [] 
    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
  })
})
describe('totalLikes', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
      }
    ]
  
    const listWithManyBlogs = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
      },
      {
        _id: '5a422b3a71b54a676234d17f9',
        title: 'Another blog',
        author: 'Author 2',
        url: 'https://example.com',
        likes: 10,
        __v: 0
      }
    ]
  
    const emptyList = []
  
    test('when list has only one blog, equals the likes of that', () => {
      const result = listHelper.totalLikes(listWithOneBlog)
      assert.strictEqual(result, 5)
    })
  
    test('when list has multiple blogs, equals the sum of their likes', () => {
      const result = listHelper.totalLikes(listWithManyBlogs)
      assert.strictEqual(result, 15)
    })
  
    test('when list is empty, equals 0', () => {
      const result = listHelper.totalLikes(emptyList)
      assert.strictEqual(result, 0)
    })
  })
  describe('favorite blog', () => {
    const blogs = [
      {
        _id: '1',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
      },
      {
        _id: '2',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://example.com/dijkstra',
        likes: 5,
        __v: 0
      },
      {
        _id: '3',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'https://example.com/canonical',
        likes: 12,
        __v: 0
      }
    ]
  
    test('returns the blog with most likes', () => {
      const result = listHelper.favoriteBlog(blogs)
      const expected = {
        _id: '3',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'https://example.com/canonical',
        likes: 12,
        __v: 0
      }
  
      assert.deepStrictEqual(result, expected)
    })
  
    test('returns null for empty list', () => {
      const result = listHelper.favoriteBlog([])
      assert.strictEqual(result, null)
    })
  })
  describe('most blogs', () => {
    const blogs = [
        {
          _id: '1',
          title: 'React patterns',
          author: 'Michael Chan',
          url: 'https://reactpatterns.com/',
          likes: 7,
          __v: 0
        },
        {
          _id: '2',
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          url: 'https://www.cs.utexas.edu/~EWD/transcriptions/EWD02xx/EWD215.html',
          likes: 5,
          __v: 0
        },
        {
          _id: '3',
          title: 'Canonical string reduction',
          author: 'Edsger W. Dijkstra',
          url: 'https://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
          likes: 12,
          __v: 0
        },
        {
          _id: '4',
          title: 'First class tests',
          author: 'Robert C. Martin',
          url: 'https://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
          likes: 10,
          __v: 0
        },
        {
          _id: '5',
          title: 'TDD harms architecture',
          author: 'Robert C. Martin',
          url: 'https://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
          likes: 0,
          __v: 0
        },
        {
          _id: '6',
          title: 'Type wars',
          author: 'Robert C. Martin',
          url: 'https://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
          likes: 2,
          __v: 0
        }
      ]
    test('returns author with highest number of blogs', () => {
      const result = listHelper.mostBlogs(blogs)
      const expected = {
        author: 'Robert C. Martin',
        blogs: 3
      }
      assert.deepStrictEqual(result, expected)
    })
  
    test('returns null for empty list', () => {
      const result = listHelper.mostBlogs([])
      assert.strictEqual(result, null)
    })
  })
  describe('most likes', () => {
    const blogs = [
        {
          _id: '1',
          title: 'React patterns',
          author: 'Michael Chan',
          url: 'https://reactpatterns.com/',
          likes: 7,
          __v: 0
        },
        {
          _id: '2',
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          url: 'https://www.cs.utexas.edu/~EWD/transcriptions/EWD02xx/EWD215.html',
          likes: 5,
          __v: 0
        },
        {
          _id: '3',
          title: 'Canonical string reduction',
          author: 'Edsger W. Dijkstra',
          url: 'https://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
          likes: 12,
          __v: 0
        },
        {
          _id: '4',
          title: 'First class tests',
          author: 'Robert C. Martin',
          url: 'https://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
          likes: 10,
          __v: 0
        },
        {
          _id: '5',
          title: 'TDD harms architecture',
          author: 'Robert C. Martin',
          url: 'https://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
          likes: 0,
          __v: 0
        },
        {
          _id: '6',
          title: 'Type wars',
          author: 'Robert C. Martin',
          url: 'https://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
          likes: 2,
          __v: 0
        }
      ]
    test('returns author with highest total likes', () => {
      const result = listHelper.mostLikes(blogs)
      assert.deepStrictEqual(result, {
        author: 'Edsger W. Dijkstra',
        likes: 17,
      })
    })
  
    test('returns null for empty list', () => {
      const result = listHelper.mostLikes([])
      assert.strictEqual(result, null)
    })
  })