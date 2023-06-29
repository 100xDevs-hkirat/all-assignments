const fs = require('fs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'secret';

const Utils = {
    readFile: async (filepath) => {
        try {
            const data = await fs.promises.readFile(filepath, 'utf-8');
            return JSON.parse(data);
        } catch (err) {
            console.log(err);
        }
    },
    writeFile: async (filepath, data) => {
        try {
            await fs.promises.writeFile(filepath, JSON.stringify(data));
            console.log(data);
        } catch (err) {
            console.log(err);
        }
    },
    getLoginToken: (username) => {
        const token = jwt.sign({
            username
        }, SECRET_KEY, { expiresIn: '1h' });
        return token;
    }
};

module.exports = Utils;
