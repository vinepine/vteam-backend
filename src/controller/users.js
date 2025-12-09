const openDb = require('../db/database.js');

async function getUsers(req, res) {
	let db;
	try {
		db = await openDb();
		const users = await db.query('SELECT * FROM vteam.users;');

		res.status(200).json({users});
	} catch (error) {
		res.json(error);
	} finally {
		if (db) db.release();
	}
}

async function specificUser(req, res) {
	const {id} = req.params;
	let db;
	try {
		db = await openDb();
		const user = await db.query('SELECT * FROM vteam.users WHERE user_id = ?', [id]);

		res.status(200).json({user});
	} catch (error) {
		res.json(error);
	} finally {
		if (db) db.release();
	}
}

module.exports = {
	getUsers,
	specificUser,
};
