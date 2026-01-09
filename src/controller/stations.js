const openDb = require('../db/database.js');

async function getStations(req, res) {
	const db = await openDb();

	try {
		const stations = await db.query('SELECT * FROM vteam.stations');

		res.status(200).json({stations});
	} catch (error) {
		res.json(error);
	} finally {
		if (db) db.release();
	}
}

async function getOneStation(req, res) {
	const db = await openDb();
	const {id} = req.params;
	try {
		const station = await db.query('SELECT * FROM vteam.stations WHERE id = ?', [id]);

		res.status(200).json({station});
	} catch (error) {
		res.status(500).json(error);
	} finally {
		if (db) db.release();
	}
}

module.exports = {
	getStations,
	getOneStation,
};
