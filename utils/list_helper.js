const _ = require('lodash')
const dummy = (blogs) =>{
    return 1 
}
const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
  }
  const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null
  
    return blogs.reduce((fav, blog) => {
      return blog.likes > fav.likes ? blog : fav
    })
  }

  const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null
  
    const grouped = _.groupBy(blogs, 'author')
    const authorsWithCount = _.map(grouped, (items, author) => ({
      author,
      blogs: items.length,
    }))
  
    return _.maxBy(authorsWithCount, 'blogs')
  }

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const groupedByAuthor = _.groupBy(blogs, 'author')

  const authorLikes = _.map(groupedByAuthor, (blogs, author) => {
    return {
      author,
      likes: _.sumBy(blogs, 'likes')
    }
  })

  return _.maxBy(authorLikes, 'likes')
}

  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }
  