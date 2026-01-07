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
    if (simInterval != null) return
    await resetSimulation();

    await insertScooters();

    simInterval = setInterval(updateInterval, 3000);

    res.json('sim started')
}

async function resetSimulation(){
    let db;
    try {
        db = await openDb();
        await db.query('DELETE FROM vteam.scooters WHERE scooter_id > 50;');
        await db.query('ALTER TABLE vteam.scooters AUTO_INCREMENT = 51;');
    } catch (error) {
        console.log(error)
    } finally {
        if (db) db.release();
    }
}

module.exports = {
    startInterval,
    updateInterval,
    stopInterval,
    resetSimulation
    
}