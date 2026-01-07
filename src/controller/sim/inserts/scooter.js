const openDb = require('../../../db/database.js');

async function insertScooters() {
    let db;

    try {
        db = await openDb();
        
        // "1","Malmö","55.6050","13.0038"
        // "2","Stockholm","59.3293","18.0686"
        // "3","Göteborg","57.706","11.954"
        const cityCoords = {
            1: [55.6050, 13.0038],
            2: [59.3293, 18.0686],
            3: [57.706, 11.954]
        }

        const values = [];
        for (let i = 0; i < 1000; i++) {
            const cityId = (i % 3) + 1
            // console.log(cityCoords[cityId][0])
            lat = cityCoords[cityId][0] + (Math.random() - 0.5) / 10
            lon = cityCoords[cityId][1] + (Math.random() - 0.5) / 10

            values.push([cityId, 0, 1, 100, lat, lon])
        }

        const sql = `
            INSERT INTO vteam.scooters (city_id, available, rented, battery, lat, lon)
            VALUES (${values.join('), (')})`

        await db.query(sql)
    } catch (error) {
        console.log(error)
    } finally {
        if (db) db.release();
    }
}

module.exports = insertScooters;
