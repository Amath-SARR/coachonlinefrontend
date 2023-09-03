module.exports = process.env.TARGET_ENV === 'production' ? require('./env.prod') : process.env.TARGET_ENV === 'stage' ? require("./env.stage") : require("./env.dev");
