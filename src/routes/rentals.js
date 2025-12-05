const openDb = require("../db/database.js");

async function getRental(req, res) {
    try {
        const db = await openDb();
        const rentals = await db.query("SELECT * FROM vteam.rentals;");
        res.status(200).json({ rentals: rentals });
    } catch (error) {
        res.json(error)
    } finally {
        if (db) db.release();
    }
}

async function getOneRental(req, res) {
    const id = req.params.id;

    try {
        const db = await openDb();
        const rental = await db.query(
            "SELECT * FROM vteam.rentals WHERE rental_id = ?",
            [id]
        );

        res.status(200).json({ rental: rental });
    } catch (error) {
        res.json(error)
    } finally {
        if (db) db.release();
    }
}

async function startRental(req, res) {
    const { id, userId, scooterId } = req.params;
    const start = Date()
    try {
        const db = await openDb();
        const available = await db.query(
            "INSERT INTO vteam.rentals (start_time, id, user_id, scooter_id) VALUES (?, ?, ?, ?)",
            [start, id, userId, scooterId]
        );

        res.status(200).json({ available: available });
    } catch (error) {
        res.json(error)
    } finally {
        if (db) db.release();
    }
}

async function endRental(req, res) {
    const { id, userId, scooterId } = req.params;
    const end = Date()

    try {
        const db = await openDb();

        const result = await db.query(
            "UPDATE vteam.rentals SET end_time = ? WHERE rental_id = ? AND user_id = ? AND scooter_id = ?",
            [end, id, userId, scooterId]
        );

        res.status(200).json({ result: result });
    } catch (error) {
        res.json(error)
    } finally {
        if (db) db.release();
    }
}


module.exports = {
    getRental,
    getOneRental,
    startRental,
    endRental
};
