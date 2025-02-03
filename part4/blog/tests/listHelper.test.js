const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

//Test dummy function
test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})


//Test total likes function
describe('total likes', () => {
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
  
    test('when list has only one blog, equals the likes of that', () => {
      const result = listHelper.totalLikes(listWithOneBlog)
      assert.strictEqual(result, 5)
    })
  })

//Test for favourite blog
describe('Favourite Blog', () => {
    const listWithManyBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f8',
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 12,
        __v: 0
      }
    ]
  
    test('get the most like blog', () => {
      const mostLiked = listHelper.favoriteBlog(listWithManyBlog)
      const result = {title: mostLiked.title, author: mostLiked.author, likes: mostLiked.likes}
      assert.deepStrictEqual(result, {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        likes: 12
      })
    })
  })


//Test for favourite blog
describe('Most active author', () => {
    const listWithManyBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f8',
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 12,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f8',
        title: "49",
        author: "Tran Duc Thinh",
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 12,
        __v: 0
      }
    ]
  
    test('get the most active author', () => {
      const result = listHelper.mostBlog(listWithManyBlog)
      assert.deepStrictEqual(result, {
        author: "Edsger W. Dijkstra",
        blogs: 2
      })
    })
  })


//Test for most like blogs
describe('Most blogs likes', () => {
  const listWithManyBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 12,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: "49",
      author: "Tran Duc Thinh",
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 12,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: "49",
      author: "Tran Duc Thinh",
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 32,
      __v: 0
    }
  ]

  test('get the most active author', () => {
    const result = listHelper.mostLiked(listWithManyBlog)
    assert.deepStrictEqual(result, {
      author: "Tran Duc Thinh",
      likes: 44
    })
  })
})