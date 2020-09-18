const router = require('express').Router();
const Joi = require('joi');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register validation schema
const register = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

// Login validation schema
const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8)
});

// Register Route
router.post('/register', async (req, res) => {
  // Validate the body
  const {
    error
  } = register.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  // Existing email check
  const existingEmail = await User.findOne({
    email: req.body.email
  });
  if (existingEmail) return res.status(400).send('Email already exists in database.');

  // Password hash
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(req.body.password, salt);

  // Create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hash
  });

  // Save new user
  try {
    const newUser = await user.save();
    res.send({
      User: newUser._id
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Login Route
router.post('/login', async (req, res) => {
  // Validate the body
  const {
    error
  } = login.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  // Existing email check
  const loginUser = await User.findOne({
    email: req.body.email
  });
  if (!loginUser) return res.status(400).send('No user found with this email.');

  // Password match
  const loginPassword = await bcrypt.compare(req.body.password, loginUser.password);
  if (!loginPassword) return res.status(400).send('Password incorrect.');

  // Assign token
  const token = jwt.sign({
    _id: loginUser._id
  }, process.env.TOKEN);
  res.header('auth-token', token).send(token);
})

module.exports = router;