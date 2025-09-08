const redisClient = require('./config-redis');
const configMongo = require('./config-mongo');

module.exports = {
    ...redisClient,
    ...configMongo
}