const mariadb = require('mariadb');
require('dotenv').config();

const host = process.env.DOCKER_HOSTING ? 'mariadb' : 'localhost';

const pool = mariadb.createPool({
	host,
	port: '3306',
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
});

async function openDb() {
	let conn;
	try {
		conn = await pool.getConnection();
		return conn;
	} catch (error) {
		console.log('error', error);
	}
}

module.exports = openDb;
