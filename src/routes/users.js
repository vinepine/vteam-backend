const openDb = require("../db/database.js")

async function getUsers(req, res) {
    try {
        const db = await openDb();
        const users = await db.query('SELECT * FROM sparkcyklarab.users;')
        console.log(users)
        res.status(200).json({ users: users })
    } catch(error){
        res.json(error)
    }
}

async function testingTwo(req, res) {
    try {
        res.json({"test2": "testing2"})
    } catch (error) {
        res.json(error)
    }
}

module.exports = {getUsers, testingTwo}