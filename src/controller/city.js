const openDb = require("../db/database.js");

async function getCitys(req, res) {
    const db = await openDb();
    try {

        const payments = await db.query("SELECT * FROM vteam.city");
        res.status(200).json({ payments: payments });
    } catch (error) {
        res.json(error)
    } finally {
        if (db) db.release();
    }
}

async function getOneCity(req, res) {
    const id = req.params.id;
    const db = await openDb();
    try {
        
        const payment = await db.query(
            "SELECT * FROM vteam.city WHERE city_id = ?",
            [id]
        );

        res.status(200).json({ payment: payment });
    } catch (error) {
        res.json(error)
    } finally {
        if (db) db.release();
    }
}

async function getCityName(req, res) {
    const db = await openDb();
    const name = req.params.name;
    
    try {
        const user = await db.query(
            "SELECT * FROM vteam.city WHERE name = ?",
            [name]
        );

        res.status(200).json({ user: user });
    } catch (error) {
        res.json(error)
    } finally {
        if (db) db.release();
    }
}

async function getBikeInCity(req, res) {
    
    const id = req.params.id;
    const db = await openDb();
    try {
        const result = await db.query(
            `SELECT vteam.scooters.scooter_id,
            vteam.scooters.available,
            vteam.scooters.rented,
            vteam.scooters.battery,
            city.name AS city_name
            FROM vteam.scooters 
            INNER JOIN vteam.city ON vteam.city.city_id=vteam.scooters.city_id
            WHERE vteam.scooters.city_id = ?`,
            [id]
        );

        res.status(200).json({ available: available });
    } catch (error) {
        res.json(error)
    } finally {
        if (db) db.release();
    }
}



module.exports = {
    getCitys,
    getOneCity,
    getCityName,
    getBikeInCity
};
