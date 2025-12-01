const mariadb = require('mariadb')
require('dotenv').config()

const pool = mariadb.createPool(
    {
        host: process.env.DB_HOST,
        port: "3306",
        user: process.env.DB_USER,
        connectionLimit: 5,
        password: process.env.DB_PASSWORD

    }
);

async function openDb() {
    let conn;
    try {
        conn = await pool.getConnection();
        return conn
    } catch (error) {
        console.log("error", error)
    }
}

module.exports = openDb