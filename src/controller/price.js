const openDb = require('../db/database.js');

async function getPrice(req, res) {
	let db;

	try {
		db = await openDb();

		const price = await db.query('SELECT ppm FROM vteam.price');

		res.status(200).json(price);
	} catch (error) {
		res.status(500).json({error});
	} finally {
		if (db) db.release();
	}
}

async function updatePrice(req, res) {
	let db;

	try {
		db = await openDb();
		const {price} = req.body;
		await db.query('UPDATE vteam.price SET ppm = ? WHERE id = 1', [price]);

		res.status(200).json('updated price');
	} catch (error) {
		res.json(error);
	} finally {
		if (db) db.release();
	}
}

module.exports = {
	getPrice,
	updatePrice,
};
