const express = require('express');
const app = express();
const mongoose = require('mongoose');
const auth = require('./routes/authentication');
const private = require('./routes/private');

require('dotenv').config();
const PORT = process.env.PORT || 3000

// Database connection
mongoose.connect(process.env.DB_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, () => {
  console.log('Connected to DB');
})

// Middleware
app.use(express.json());

// Route middleware
app.use('/api/user', auth);
app.use('/api/private', private);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));