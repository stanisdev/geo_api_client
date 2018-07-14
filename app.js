const express = require('express');
const logger = require('morgan');
const glob = require('glob');
const nunjucks = require('nunjucks');
const path = require('path');
const helmet = require('helmet');

const configPath = path.join(__dirname, '/config/config.js');
const config = require(configPath);
const app = express();
app.use(helmet());
app.use(logger('dev'));

process.env.CONFIG_PATH = configPath;
process.env.APP_FILE_PATH = path.join(__dirname, '/app.js');

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'nunjucks');
const nunjucksConfig = {
  autoescape: true,
  noCache: true,
  express: app
};
nunjucks.configure(__dirname + '/views', nunjucksConfig);
module.exports = app;

/**
 * Load routes
 */
const routes = glob.sync(config.routes_path + '/*.js');
routes.forEach((route) => {
  require(route);
});
