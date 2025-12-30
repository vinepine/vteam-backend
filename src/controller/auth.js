const jwt = require('jsonwebtoken');
const openDb = require('../db/database.js');
const bcrypt = require('bcryptjs');
const secret = process.env.JWT_SECRET;

const salt = 10;

async function register(req, res) {
	let db;
	const {email} = req.body;
	const hash = await bcrypt.hash(req.body.password, salt);

	try {
		db = await openDb();
		await db.query('INSERT INTO vteam.users (email, hashed_password) VALUES (?, ?)', [email, hash]);

		res.status(201).json('user created');
	} catch (error) {
		res.json(error);
	} finally {
		if (db) {
			db.release();
		}
	}
}

async function login(req, res) {
	let db;
	const {email} = req.body;
	const {password} = req.body;

	try {
		db = await openDb();

		const user = await db.query('SELECT * FROM vteam.users WHERE email = ?', [email]);

		bcrypt.compare(password, user[0].hashed_password, async (err, match) => {
			if (match) {
				const token = jwt.sign(user[0], secret, {expiresIn: '1h'});

				return res.status(200).json({token});
			}

			res.status(500).json({message: 'Wrong credentials'});
		});
	} catch (error) {
		res.json(error);
	} finally {
		if (db) db.release();
	}
}

module.exports = {
	register,
	login,
};
