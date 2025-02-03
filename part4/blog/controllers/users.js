const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body

  // Check if username and password are provided
  if (!username || !password) {
    const missingField = !username ? 'Username' : 'Password'
    return response.status(400).json({
      error: `${missingField} is required`
    })
  }

  // Check if username is too short
  if (username.length < 3) {
    return response.status(400).json({
      error: 'Username must be at least 3 characters long'
    })
  }

  // Check if password is too short
  if (password.length < 3) {
    return response.status(400).json({
      error: 'Password must be at least 3 characters long'
    })
  }

  try {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash,
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      // Duplicate username error
      return response.status(400).json({ error: 'Username must be unique' })
    }

    next(error)
  }
})



usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs')
  response.json(users);
});

module.exports = usersRouter;
