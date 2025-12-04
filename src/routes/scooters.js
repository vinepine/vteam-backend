const openDb = require("../db/database.js");

async function getScooters(req, res) {
    try {
        const db = await openDb();
        const scooters = await db.query("SELECT * FROM vteam.scooters;");
        res.status(200).json({ scooters: scooters });
    } catch (error) {
        res.json(error)
    } finally {
        if (db) db.release();
    }
}

async function getOneScooter(req, res) {
    const id = req.params.id;

    try {
        const db = await openDb();
        const scooter = await db.query(
            "SELECT * FROM vteam.scooters WHERE scooter_id = ?",
            [id]
        );

        res.status(200).json({ scooter: scooter });
    } catch (error) {
        res.json(error)
    } finally {
        if (db) db.release();
    }
}

async function getAvailable(req, res) {
    try {
        const db = await openDb();
        const available = await db.query(
            "SELECT * FROM vteam.scooters WHERE available = True"
        );

        res.status(200).json({ available: available });
    } catch (error) {
        res.json(error)
    } finally {
        if (db) db.release();
    }
}

async function updateAvailable(req, res) {
    const { id, available } = req.params;

    try {
        const db = await openDb();

        const result = await db.query(
            "UPDATE vteam.scooters SET available = ? WHERE scooter_id = ?",
            [availableValue, id]
        );

        res.status(200).json({ available: available });
    } catch (error) {
        res.json(error)
    } finally {
        if (db) db.release();
    }
}


module.exports = {
    getScooters,
    getOneScooter,
    getAvailable,
    updateAvailable
};
