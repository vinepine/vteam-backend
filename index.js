const express = require('express')
const users = require('./src/routes/users.js');
const scooters = require('./src/routes/scooters.js');
const app = express();

const port = process.env.PORT || 3000;

app.get('/v1/users', users.getUsers);

app.get('/v1/users/:id', users.specificUser);

app.get('/v1/bike', scooters.getScooters);

app.get('/v1/bike/:id', scooters.getOneScooter);

app.get('/v1/bike/available', scooters.getAvailable);

app.get('/v1/bike/:id/:available', scooters.updateAvailable);


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});