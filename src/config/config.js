require('dotenv').config();

const config = {
    coreApiUrl: process.env.CORE_API_URL,
    port: process.env.PORT || 3001,
    rptApiUrl: process.env.RPT_API_URL,
};

module.exports = config;
