if ( process.env.DEV_PRODUCTION === 'dev' ){
  console.log('using dev keys.. if you are user, the app won\'t load, see troubleshooting at github page');
  module.exports = require('./devApiKeys');
}
else if (process.env.DEV_PRODUCTION === 'heroku'){
  console.log('heroku keys will use environment variables');
  module.exports = require('./herokuApiKeys');
}
else{
  console.log('using user keys.. make sure to change userApiKeys.js.');
  module.exports = require('./userApiKeys');
}