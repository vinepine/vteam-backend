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

async function deleteUser(req, res) {
	const id = parseInt(req.params.id, radix);
	const {user_id} = req.user;
	let db;

	if (user_id !== id) return res.json('No permission');

	try {
		db = await openDb();
		await db.query('DELETE FROM vteam.users WHERE user_id = ?', [id]);

		res.status(202).json('User deleted');
	} catch (error) {
		res.status(500).json(error);
	} finally {
		if (db) db.release();
	}
}

async function loadBalance(req, res) {
	const {amount} = req.params;
	const {user_id} = req.user;
	let db;

	try {
		db = await openDb();
		await db.query('UPDATE vteam.users SET balance = balance + ? WHERE user_id = ?', [amount, user_id]);
		res.json('balance updated');
	} catch (error) {
		res.status(500).json(error);
	} finally {
		if (db) db.release();
	}
}

module.exports = {
	getUsers,
	specificUser,
	deleteUser,
	loadBalance,
};
