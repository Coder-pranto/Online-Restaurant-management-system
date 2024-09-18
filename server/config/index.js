const path = require('path');

require('dotenv').config({
    path: path.join(process.cwd(), '.env')
})

module.exports = {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT || 5000,
    database_url: process.env.DATABASE_URL,
    secret_key: process.env.SECRET_KEY,
    secret_key: process.env.SUPER_ADMIN_TOKEN
}