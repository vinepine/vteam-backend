const openDb = require("../db/database.js");

async function getPayments(req, res) {
    const db = await openDb();
    try {

        const payments = await db.query("SELECT * FROM vteam.payments");
        res.status(200).json({ payments: payments });
    } catch (error) {
        res.json(error)
    } finally {
        if (db) db.release();
    }
}

async function getOnePayment(req, res) {
    const id = req.params.id;
    const db = await openDb();
    try {
        
        const payment = await db.query(
            "SELECT * FROM vteam.payments WHERE payment_id = ?",
            [id]
        );

        res.status(200).json({ payment: payment });
    } catch (error) {
        res.json(error)
    } finally {
        if (db) db.release();
    }
}

async function getUserPayment(req, res) {
    const db = await openDb();
    const id = req.params.id;
    
    try {
        const user = await db.query(
            "SELECT * FROM vteam.payments WHERE user_id = ?",
            [id]
        );

        res.status(200).json({ user: user });
    } catch (error) {
        res.json(error)
    } finally {
        if (db) db.release();
    }
}

async function getAmountPayment(req, res) {
    
    const amount = req.params.amount;
    const db = await openDb();
    try {
        const result = await db.query(
            "SELECT * FROM vteam.payments WHERE amount = ?",
            [amount]
        );

        res.status(200).json({ available: available });
    } catch (error) {
        res.json(error)
    } finally {
        if (db) db.release();
    }
}

async function createPayment(req, res) {
    
    const { rentalId, userId, paymentMethod, amount } = req.params.amount;
    const db = await openDb();
    try {
        const result = await db.query(
            "INSERT INTO vteam.payments (rental_id, user_id, pay_method, amount) VALUES (?, ?, ?, ?)",
            [ rentalId, userId, paymentMethod, amount ]
        );

        res.status(200).json({ result: result });
    } catch (error) {
        res.json(error)
    } finally {
        if (db) db.release();
    }
}


module.exports = {
    getPayments,
    getOnePayment,
    getUserPayment,
    getAmountPayment,
    createPayment
};
