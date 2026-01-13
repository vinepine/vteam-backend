const openDb = require("../../db/database.js");
const insertScooters = require('./inserts/scooter.js');
const insertUsers = require('./inserts/users.js');

let simInterval = null;

async function updateInterval() {
    let db;
    try {
        db = await openDb();
        await db.query(`
            UPDATE vteam.scooters
            SET
                lat = FORMAT(lat + lat*(RAND() - 0.5)*0.00001, 4),
                lon = FORMAT(lon + lon*(RAND() - 0.5)*0.00001, 4)
            WHERE scooter_id > 50;`
        );
        console.log("updated..")
    } catch (error) {
        res.json(error)
    } finally {
        if (db) db.release();
    }
}

async function stopInterval(req, res) {
    if (!simInterval) return res.json('no sim ongoing')

    if (simInterval) {
        clearInterval(simInterval);
        console.log('simulation stopped')
        simInterval = null
        res.json('sim stopped')
    }
}

async function startInterval(req, res) {
    if (simInterval != null) return res.json('simulation already running');

    await resetSimulationInternal();

    await insertScooters(req.params.amount);
    await insertUsers(req.params.amount);

    simInterval = setInterval(updateInterval, 3000);

    res.json('sim started');
}

async function resetSimulationInternal() {
    let db;
    try {
        db = await openDb();
        await db.query('DELETE FROM vteam.scooters WHERE scooter_id > 50;');
        await db.query('ALTER TABLE vteam.scooters AUTO_INCREMENT = 51;');
        await db.query('DELETE FROM vteam.users WHERE user_id > 99;')
        await db.query('ALTER TABLE vteam.users AUTO_INCREMENT = 20;')
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        if (db) db.release();
    }
}

async function resetSimulation(req, res) {
    try {
        await resetSimulationInternal();
        res.json('sim reset');
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = {
    startInterval,
    updateInterval,
    stopInterval,
    resetSimulation
    
}