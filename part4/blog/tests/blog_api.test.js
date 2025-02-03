const { test, after, beforeEach, describe} = require('node:test')
const assert = require('node:assert')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

//4.23

/////////////////////////Use node to test,some how npm not work//////////////////
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
      _id: '5a422aa71b54a676234d17f2',
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 12,
      __v: 0
    }
]
let token

beforeEach(async () => {
    await Blog.deleteMany({});
    
    const loginResponse = await supertest(app)
        .post('/api/login')
        .send({ username: 'T500', password: '1234' });
    token = loginResponse.body.token;

    const blogObject1 = new Blog({ ...listWithManyBlog[0], user: loginResponse.body.id });
    await blogObject1.save();

    const blogObject2 = new Blog({ ...listWithManyBlog[1], user: loginResponse.body.id });
    await blogObject2.save();
});


//4.8

test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
  
    assert.strictEqual(response.body.length, 2)
})
  
test('the first note is about Go To Statement Considered Harmful', async () => {
    const response = await api.get('/api/blogs')
  
    const contents = response.body.map(e => e.title)
    assert.strictEqual(contents.includes('Go To Statement Considered Harmful'), true)
})


//4.9
test('Check identifier unique', async () => {
    const response = await api.get('/api/blogs');
    const ids = response.body.map(e => e.id);

    // Check for uniqueness by comparing the size of the array to the size of a Set
    const uniqueIds = new Set(ids);
    assert.strictEqual(uniqueIds.size, ids.length);
});

//4.10 A valid blog can be added
test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'Lang vu dai ngay ay',
        author: 'Nam Cao',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Nam.pdf',
        likes: 5,
    };

    // Post a new blog
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    // Fetch the updated list of blogs
    const response = await api.get('/api/blogs');
    const ids = response.body.map(r => r.id);

    // Check that the new blog was added
    const uniqueIds = new Set(ids);
    assert.strictEqual(uniqueIds.size, 3);
});

//4.11 Default likes
test('if likes property is missing, it defaults to 0', async () => {
    const newBlog = {
        title: 'Lang vu dai ngay ay',
        author: 'Nam Cao',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Nam.pdf',
    };

    const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    // Check if the blog is saved with the default value for likes
    assert.strictEqual(response.body.likes, 0);
});


test('if title or url is missing, respond with 400', async () => {

    const newBlog = {
        author: 'Nam Cao',
        likes: 5,
    };

    const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/);
    
    // Check if the response contains an error message
    assert.strictEqual(response.body.error, 'Title and URL are required');
});



//4.13
test('a blog can be deleted', async () => {

    // Create a blog
    const newBlog = {
        title: 'Blog to be deleted',
        author: 'Test Author',
        url: 'http://example.com',
        likes: 5,
    };

    const createdBlog = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201);

    console.log('Created Blog:', createdBlog.body.id);

    // Perform DELETE request
    const deleteResponse = await api
        .delete(`/api/blogs/${createdBlog.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

    console.log('Delete Response:', deleteResponse.body);

    // Verify the blog no longer exists
    const blogsAtEnd = await api.get('/api/blogs');
    console.log('Blogs at End:', blogsAtEnd.body);

    expect(blogsAtEnd.body).not.toContainEqual(
        expect.objectContaining({ title: 'Blog to be deleted' })
    );
});



//4.14
test('updating likes of a blog post', async () => {
    // Fetch the initial list of blogs
    const initialBlogs = await api.get('/api/blogs');
    const blogToUpdate = initialBlogs.body[0];

    // Update the likes of the first blog
    const updatedBlogData = { likes: blogToUpdate.likes + 10 };

    const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedBlogData)
        .expect(200)
        .expect('Content-Type', /application\/json/);

    // Check the updated blog
    assert.strictEqual(response.body.likes, blogToUpdate.likes + 10);

    // Fetch the blogs again and verify the change
    const blogsAfterUpdate = await api.get('/api/blogs');
    const updatedBlog = blogsAfterUpdate.body.find(b => b.id === blogToUpdate.id);
    assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 10);
});

after(async () => {
    await mongoose.connection.close()
})