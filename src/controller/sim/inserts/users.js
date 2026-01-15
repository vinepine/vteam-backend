const openDb = require('../../../db/database.js');

async function insertUsers(amount) {
	let db;
	try {
		db = await openDb();
		const values = [];
		for (let i = 0; i < amount; i++) {
			values.push([`'sim${i}', 'password', 40`]);
		}

		await db.query('ALTER TABLE vteam.users AUTO_INCREMENT = 100');
		const sql = `INSERT INTO vteam.users (email, hashed_password, balance) VALUES (${values.join('), (')})`;
		await db.query(sql);
	} catch (error) {
		console.log(error);
	} finally {
		db.release();
	}
}

module.exports = insertUsers;
