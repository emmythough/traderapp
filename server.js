const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize Express
const app = express();

// Use body-parser middleware to parse request bodies
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/traderapp', { useNewUrlParser: true, useUnifiedTopology: true });

// Define User model
const User = mongoose.model('User', {
  name: String,
  email: String,
  password: String, // Note: In a real-world application, you should hash passwords before storing them
});

// Registration route
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Create a new user
  const user = new User({ name, email, password });

  // Save the user to the database
  await user.save();

  // Send a response
  res.status(201).send({ message: 'User registered successfully' });
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Find the user with the provided email
  const user = await User.findOne({ email });

  // If no user is found, or the password doesn't match, send an error
  if (!user || user.password !== password) {
    return res.status(400).send({ message: 'Invalid email or password' });
  }

  // If everything is okay, send a success message
  res.send({ message: 'Logged in successfully' });
});

// Start the server
app.listen(3000, () => console.log('Server is running on port 3000'));