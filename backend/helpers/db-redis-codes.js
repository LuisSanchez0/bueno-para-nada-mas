const { redisClient } = require("../database");


const CODE_EXPIRATION = 15 * 60; //!Colocar el tiempo de expiración en segundos

const setVerificationCode = async (email, code, type) => {
    const key = `${type}:${email}`;
    await redisClient.setEx(key, CODE_EXPIRATION, code);
};

const getVerificationCode = async (email, type) => {
    const key = `${type}:${email}`;
    return await redisClient.get(key);
};

const deleteVerificationCode = async (email, type) => {
    const key = `${type}:${email}`;
    await redisClient.del(key);
};

module.exports = {
    setVerificationCode,
    getVerificationCode,
    deleteVerificationCode
};