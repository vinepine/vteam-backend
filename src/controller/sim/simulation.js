const openDb = require("../../db/database.js");
const insertScooters = require('./inserts/scooter.js');

let simInterval = null;

async function updateInterval() {
    let db;
    try {
        db = await openDb();
        await db.query(`
            UPDATE vteam.scooters
            SET
                lat = FORMAT(lat + lat*(RAND() - 0.5)*0.001, 4),
                lon = FORMAT(lon + lon*(RAND() - 0.5)*0.001, 4);`
        );
        console.log("updated..")
    } catch (error) {
        res.json(error)
    } finally {
        if (db) db.release();
    }
}

async function updateBattery() {
    let db;
    try {
        db = await openDb();
        await db.query(`
            UPDATE vteam.scooters
            SET battery = battery - 1;`
        );
        console.log("battery updated..")
    } catch (error) {
        res.json(error)
    } finally {
        if (db) db.release();
    }
}

async function stopInterval(req, res) {
    if (!simInterval) res.json('no sim ongoing')

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

    simInterval = setInterval(updateInterval, 3000);
    batteryInterval = setInterval(updateBattery, 61000);

    res.json('sim started');
}

async function resetSimulationInternal() {
    let db;
    try {
        db = await openDb();
        await db.query('DELETE FROM vteam.scooters WHERE scooter_id > 50;');
        await db.query('ALTER TABLE vteam.scooters AUTO_INCREMENT = 51;');
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
        res.status(500).json('error');
    }
}

module.exports = {
    startInterval,
    updateInterval,
    stopInterval,
    resetSimulation
    
}