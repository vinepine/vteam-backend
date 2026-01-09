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
		if (db) db.release();
	}
}

async function login(req, res) {
    let db;
    const {email} = req.body;
    const {password} = req.body;

    try {
        db = await openDb();

        const user = await db.query('SELECT * FROM vteam.users WHERE email = ?', [email]);

        if (!user || user.length === 0) {
            return res.status(401).json({message: 'Wrong credentials'});
        }

        const match = await bcrypt.compare(password, user[0].hashed_password);
        
        if (match) {
            const token = jwt.sign({ id: user[0].id, email: user[0].email }, secret, {expiresIn: '1h'});
            return res.status(200).json({token});
        }

        res.status(401).json({message: 'Wrong credentials'});
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
