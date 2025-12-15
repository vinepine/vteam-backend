const openDb = require('../db/database.js');

async function getScooters(req, res) {
	const db = await openDb();
	try {
		const scooters = await db.query('SELECT * FROM vteam.scooters');
		res.status(200).json({scooters});
	} catch (error) {
		res.json(error);
	} finally {
		if (db) db.release();
	}
}

async function getOneScooter(req, res) {
	const {id} = req.params;
	const db = await openDb();
	try {
		const scooter = await db.query(
			'SELECT * FROM vteam.scooters WHERE scooter_id = ?',
			[id],
		);

		res.status(200).json({scooter});
	} catch (error) {
		res.json(error);
	} finally {
		if (db) db.release();
	}
}

async function getAvailable(req, res) {
	const db = await openDb();

	try {
		const available = await db.query('SELECT * FROM vteam.scooters WHERE available = 1');

		res.status(200).json({available});
	} catch (error) {
		res.json(error);
	} finally {
		if (db) db.release();
	}
}

async function updateAvailable(req, res) {
	const {id, available} = req.params;
	const db = await openDb();
	try {
		await db.query(
			'UPDATE vteam.scooters SET available = ? WHERE scooter_id = ?',
			[available, id],
		);

		res.status(200).json({available});
	} catch (error) {
		res.json(error);
	} finally {
		if (db) db.release();
	}
}

module.exports = {
	getScooters,
	getOneScooter,
	getAvailable,
	updateAvailable,
};
