const jwt = require('jsonwebtoken');
const openDb = require('../db/database.js')
const bcrypt = require('bcryptjs');
const secret = process.env.JWT_SECRET

const salt = 10;

async function register(req, res) {

    let db;
    const email = req.body.email
    const hash = await bcrypt.hash(req.body.password, salt);

    try {
        db = await openDb();
        await db.query(`INSERT INTO vteam.users (email, hashed_password) VALUES (?, ?)`, [email, hash])

        res.status(201).json("user created")
    } catch (error) {
        res.json(error)
    } finally {
        if (db) db.release();
    }
};

async function login(req, res) {
    let db;
    const email = req.body.email;
    const password = req.body.password

    try {
        db = await openDb();
        const user = await db.query(`SELECT * FROM vteam.users WHERE email = ?`, [email]);

        bcrypt.compare(password, user[0].hashed_password, async (err, res) => {
            console.log(res);
        });

        res.status(200).json({user: user[0]})
    } catch (error) {
        res.json(error)
    } finally {
        if (db) db.release();
    }
}
 
module.exports = {
    register,
    login
};
