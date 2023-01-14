const express = require('express');
const cors = require('cors');

const server = express();
server.use(cors());
server.use(express.json());

const articleRoutes = require('./routes/articles')

server.use('/articles', articleRoutes)

// Root route
server.get('/', (req, res) => res.send('Hello, world!'))

module.exports = server