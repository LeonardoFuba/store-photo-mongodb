const { Router } = require('express');
const readfile = require('./readfile');
const writefile = require('./writefile');

const routes = Router();

routes.post('/save', writefile.store); //store photo on MongoDB database
routes.get('/search', readfile.index); //query and download photo from MongoDB database
//I've been testing with insomnia

module.exports = routes;