const {AuthorizationCode} = require('simple-oauth2');
const jwt = require('jsonwebtoken');

const openDb = require('../db/database.js');
const secret = process.env.JWT_SECRET;

const config = {
	client: {
		id: '699849270700-6uf637c88eu7oi49rqtat5s8n7rkacsc.apps.googleusercontent.com',
		secret: process.env.OAUTH_SECRET,
	},
	auth: {
		authorizeHost: 'https://accounts.google.com',
		authorizePath: '/o/oauth2/v2/auth',
		tokenHost: 'https://oauth2.googleapis.com',
		tokenPath: '/token',
	},
};

const client = new AuthorizationCode(config);

async function run(req, res) {
	const authorizationUri = client.authorizeURL({
		redirect_uri: 'http://localhost:3001/callback',
		scope: 'openid email profile',
		state: 'testing',
	});

	res.redirect(authorizationUri);
}

async function callback(req, res) {
	const {code} = req.query;

	const options = {
		code,
		redirect_uri: 'http://localhost:3001/callback',
	};

	let db;
	try {
		const accessToken = await client.getToken(options);
		const decodedToken = jwt.decode(accessToken.token.id_token);

		db = await openDb();
		let user = await db.query('SELECT * FROM vteam.users WHERE email = ?', [decodedToken.email]);

		if (user.length === 0) {
			await db.query(
				'INSERT INTO vteam.users (email, hashed_password) VALUES (?, ?)',
				[decodedToken.email, decodedToken.at_hash],
			);
			user = await db.query('SELECT * FROM vteam.users WHERE email = ?', [decodedToken.email]);
		}

		if (accessToken) {
			const token = jwt.sign({ user_id: user[0].user_id, email: user[0].email }, secret, {expiresIn: '1h'});

			return res.redirect(`http://localhost:3000/callback?token=${token}`);
		}

		res.send('something went wrong');
	} catch (error) {
		res.status(500).send(error);
	} finally {
		if (db) db.release();
	}
}

module.exports = {
	callback,
	run,
};
