const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Helper function to extract token from Authorization header
const getTokenFrom = request => {
    const authorization = request.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '');
    }
    return null;
};

// Middleware to extract user from token
const userExtractor = async (request, response, next) => {
    const token = getTokenFrom(request);
    if (!token) {
        return response.status(401).json({ error: 'Token missing or invalid' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET);
        if (!decodedToken.id) {
            return response.status(401).json({ error: 'Token invalid' });
        }

        const user = await User.findById(decodedToken.id);
        if (!user) {
            return response.status(404).json({ error: 'User not found' });
        }

        request.user = user;
        next();
    } catch (error) {
        return response.status(401).json({ error: 'Token invalid' });
    }
};

// GET all blogs
blogsRouter.get('/', async (request, response) => {
    try {
        const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
        response.json(blogs);
    } catch (error) {
        response.status(500).json({ error: 'Failed to fetch blogs' });
    }
});

// POST new blog
blogsRouter.post('/', userExtractor, async (request, response) => {
    const { title, author, url, likes } = request.body;
    const user = request.user;  // Now available from the middleware

    if (!title || !url) {
        return response.status(400).json({ error: 'Title and URL are required' });
    }

    try {
        const blog = new Blog({
            title,
            author,
            url,
            likes: likes || 0,
            user: user._id,
        });

        const savedBlog = await blog.save();
        user.blogs = user.blogs.concat(savedBlog._id);
        await user.save();

        response.status(201).json(savedBlog);
    } catch (error) {
        response.status(500).json({ error: 'Failed to save blog', details: error.message });
    }
});

// DELETE blog
// DELETE blog
blogsRouter.delete('/:id', userExtractor, async (request, response) => {
    const { id } = request.params;
    const user = request.user; // Extracted from the token by userExtractor

    try {
        const blog = await Blog.findById(id).populate('user'); // Populate the user field

        if (!blog) {
            return response.status(404).json({ error: 'Blog not found' });
        }

        // Check if blog.user is populated with the full user document
        console.log('Blog user:', blog.user);  // Log the entire blog.user object (should be populated)
        console.log('Authenticated user:', user._id); // Log the authenticated user object

        // Assuming blog.user is populated as a full user document
        if (blog.user._id.toString() !== user._id.toString()) {
            return response.status(403).json({ error: 'Permission denied' });
        }

        await Blog.deleteOne({ _id: id }); // Delete the blog
        response.status(204).end();
    } catch (error) {
        console.error('Error during deletion:', error.message);
        response.status(500).json({ error: 'Internal server error', details: error.message });
    }
});




// Update blog
blogsRouter.put('/:id', userExtractor, async (req, res) => {
    const { id } = req.params; // Use req here to stay consistent
    const user = req.user; // Extracted from the token by userExtractor

    const { likes, title, author, url } = req.body; // Use req.body for data

    try {
        const blog = await Blog.findById(id).populate('user');

        // Check if the user is the owner of the blog
        if (blog.user._id.toString() !== user._id.toString()) {
            return res.status(403).json({ error: 'Permission denied' });
        }

        // Update blog with the new data, ensure likes is not undefined
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,  // The blog ID
            { 
                likes: likes !== undefined ? likes : blog.likes,  // Set likes only if provided, otherwise retain current value
                title,
                author,
                url 
            },  
            { new: true, runValidators: true, context: 'query' }
        );

        if (updatedBlog) {
            res.status(200).json(updatedBlog); // Send the updated blog as response
        } else {
            res.status(404).send({ error: 'Blog not found' }); // If no blog is found with that ID
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' }); // Catch any errors
    }
});

module.exports = blogsRouter;
