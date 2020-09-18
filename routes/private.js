const router = require('express').Router();
const User = require('../models/User');
const verify = require('./authorization');

router.get('/', verify, (req, res) => {
  res.send(req.user);
})

module.exports = router;