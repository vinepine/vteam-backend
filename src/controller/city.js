const openDb = require('../db/database.js');

async function getCitys(req, res) {
	const db = await openDb();
	const {user_id} = req.user;
	console.log(user_id);
	try {
		const cities = await db.query('SELECT * FROM vteam.city');
		res.status(200).json({cities});
	} catch (error) {
		res.json(error);
	} finally {
		if (db) db.release();
	}
}

async function getOneCity(req, res) {
	const {id} = req.params;
	const db = await openDb();
	try {
		const city = await db.query(
			'SELECT * FROM vteam.city WHERE city_id = ?',
			[id],
		);

		res.status(200).json({city});
	} catch (error) {
		res.json(error);
	} finally {
		if (db) db.release();
	}
}

async function getCityName(req, res) {
	const db = await openDb();
	const {name} = req.params;

	try {
		const user = await db.query(
			'SELECT * FROM vteam.city WHERE name = ?',
			[name],
		);

		res.status(200).json({user});
	} catch (error) {
		res.json(error);
	} finally {
		if (db) db.release();
	}
}

async function getBikeInCity(req, res) {
	const {id} = req.params;
	const db = await openDb();
	try {
		const result = await db.query(
			`SELECT vteam.scooters.scooter_id,
            vteam.scooters.available,
            vteam.scooters.rented,
            vteam.scooters.battery,
            city.name AS city_name
            FROM vteam.scooters 
            INNER JOIN vteam.city ON vteam.city.city_id=vteam.scooters.city_id
            WHERE vteam.scooters.city_id = ?`,
			[id],
		);

		res.status(200).json({result});
	} catch (error) {
		res.json(error);
	} finally {
		if (db) db.release();
	}
}

module.exports = {
	getCitys,
	getOneCity,
	getCityName,
	getBikeInCity,
};
