const emailGenerator = require('./email-generator');
const dbValidators = require('./db-validators');
const generateJWT = require('./generate-jwt');

module.exports = {
    ...emailGenerator,
    ...dbValidators,
    ...generateJWT,
}