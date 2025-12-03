const openDb = require("../db/database.js")

async function getUsers(req, res) {
    try {
        const db = await openDb();
        const users = await db.query('SELECT * FROM vteam.users;')
        console.log(users)
        res.status(200).json({ users: users })
    } catch(error){
        res.json(error)
    }
}

async function specificUser(req, res) {

    const id = req.params.id

    try {
        const db = await openDb()
        const user = await db.query("SELECT * FROM vteam.users WHERE user_id = ?", [id])

        res.status(200).json({user: user})
    } catch (error) {
        res.json(error)
    }
}

module.exports = {
    getUsers,
    specificUser
}
