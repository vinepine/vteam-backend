const openDb = require('../db/database.js');

// Kanske kan tas bort?
async function getRental(req, res) {
	let db;

	try {
		db = await openDb();
		const rentals = await db.query('SELECT * FROM vteam.rentals;');
		res.status(200).json({rentals});
	} catch (error) {
		res.json(error);
	} finally {
		if (db) db.release();
	}
}

// Om gjord för att hämta hyror för specifikt inloggade använderen.
async function getMyRentals(req, res) {
	const {user_id: userId} = req.user || {};
	if (!userId) return res.status(401).json({message: 'Missing user in token'});

	let db;
	try {
		db = await openDb();
		const rentals = await db.query('SELECT * FROM vteam.rentals WHERE user_id = ?', [userId]);
		res.status(200).json({rentals});
	} catch (error) {
		res.json(error);
	} finally {
		if (db) db.release();
	}
}

async function getOneRental(req, res) {
	const {id} = req.params;
	const db = await openDb();
	try {
		const rental = await db.query(
			'SELECT * FROM vteam.rentals WHERE rental_id = ?',
			[id],
		);

		res.status(200).json({rental});
	} catch (error) {
		res.json(error);
	} finally {
		if (db) db.release();
	}
}

// Omgjord för att sätta "krav" inför en hyrning, med saldo kontroll. samt const start omgjord för att hämta aktuell tid. id bytt till user_id och scooter_id för att passa in i db.
async function startRental(req, res) {
	const {userId, scooterId} = req.params;
	const start = new Date().toISOString().slice(0, 19).replace('T', ' ');
	const db = await openDb();
	try {
		// Kolla användarens saldo
		const userResult = await db.query('SELECT balance FROM vteam.users WHERE user_id = ?', [userId]);
		if (!userResult || userResult.length === 0) {
			return res.status(404).json({error: 'Användare hittades inte'});
		}

		const balance = userResult[0].balance || 0;
		const minBalance = 10; // Minsta saldo för att starta hyra

		if (balance < minBalance) {
			return res.status(400).json({
				error: 'Otillräckligt saldo',
				message: `Du behöver minst ${minBalance} kr för att hyra en cykel. Ditt saldo: ${balance.toFixed(2)} kr`,
			});
		}

		// Markera cykeln som upptagen
		await db.query(
			'UPDATE vteam.scooters SET available = FALSE, rented = TRUE WHERE scooter_id = ?',
			[scooterId],
		);

		const result = await db.query(
			'INSERT INTO vteam.rentals (start_time, user_id, scooter_id) VALUES (?, ?, ?)',
			[start, userId, scooterId],
		);

		res.status(200).json({success: true, rental_id: Number(result.insertId)});
	} catch (error) {
		console.error('Error starting rental:', error);
		res.status(500).json({error: error.message});
	} finally {
		if (db) db.release();
	}
}

async function endRental(req, res) {
	const {id, userId, scooterId} = req.params;
	const end = new Date().toISOString().slice(0, 19).replace('T', ' ');
	const db = await openDb();
	try {
		// Hämta hyran
		const rentalResult = await db.query(
			'SELECT * FROM vteam.rentals WHERE rental_id = ? AND user_id = ?',
			[id, userId],
		);

		if (!rentalResult || rentalResult.length === 0) {
			return res.status(404).json({error: 'Hyra hittades inte'});
		}

		const rental = rentalResult[0];

		// Beräkna kostnad (pris per minut)
		const priceResult = await db.query('SELECT ppm FROM vteam.price WHERE id = 1');
		const pricePerMinute = (priceResult && priceResult[0]) ? priceResult[0].ppm : 2.5;

		console.log(`Pris per minut: ${pricePerMinute} kr`);

		const startTime = new Date(rental.start_time);
		const endTime = new Date(end);
		const minutes = Math.ceil((endTime - startTime) / 1000 / 60);
		const cost = Math.max(minutes * pricePerMinute, 5); // Minst 5 kr

		console.log(`Hyrtid: ${minutes} minuter, Kostnad: ${cost.toFixed(2)} kr`);

		// Hämta nuvarande saldo/ blir skuld vid negativt saldo.
		const userResult = await db.query('SELECT balance FROM vteam.users WHERE user_id = ?', [userId]);
		const currentBalance = (userResult && userResult[0]) ? userResult[0].balance : 0;

		// Uppdatera hyran
		await db.query(
			'UPDATE vteam.rentals SET end_time = ? WHERE rental_id = ?',
			[end, id],
		);

		// Markera cykeln som tillgänglig igen
		await db.query(
			'UPDATE vteam.scooters SET available = TRUE, rented = FALSE WHERE scooter_id = ?',
			[scooterId],
		);

		// Dra pengar från saldo
		await db.query(
			'UPDATE vteam.users SET balance = balance - ? WHERE user_id = ?',
			[cost, userId],
		);

		// Skapa betalning
		await db.query(
			'INSERT INTO vteam.payments (rental_id, user_id, pay_method, amount, status) VALUES (?, ?, ?, ?, ?)',
			[id, userId, 'balance', cost, 'completed'],
		);

		res.status(200).json({
			success: true,
			cost: cost.toFixed(2),
			minutes,
			newBalance: (currentBalance - cost).toFixed(2),
		});
	} catch (error) {
		console.error('Error ending rental:', error);
		res.status(500).json({error: error.message});
	} finally {
		if (db) db.release();
	}
}

module.exports = {
	getRental,
	getMyRentals,
	getOneRental,
	startRental,
	endRental,
};
