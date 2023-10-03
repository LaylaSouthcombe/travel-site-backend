const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const server = express();
server.use(cors());
server.use(bodyParser.json({ limit: '50mb' }));
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(express.json());

const articleRoutes = require('./routes/articles')

server.use('/articles', articleRoutes)

// Root route
server.get('/', (req, res) => res.send('Hello, world!'))

module.exports = server