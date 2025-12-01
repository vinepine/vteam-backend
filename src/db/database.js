const mariadb = require('mariadb')

const pool = mariadb.createPool(
    {
        host: "127.0.0.1",
        port: "3306",
        user: "vteam01",
        connectionLimit: 5,
        password: "skogaholmslimpa"
    });

async function openDb() {
    let conn;
    try {
        conn = await pool.getConnection('sparkcyklarab');

        return conn
    } catch (error) {
        console.log("error", error)
    }
}

module.exports = openDb