const path = require('path');
const rootDir = path.dirname(__dirname);

module.exports = {
  port_default: 6000,
  routes_path: path.join(rootDir, '/routes'),
};
