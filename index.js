const express = require('express')
const users = require('./src/routes/users.js');
const scooters = require('./src/routes/scooters.js');
const stations = require('./src/routes/stations.js');
const app = express();

const port = process.env.PORT || 3001;

app.get('/v1/users', users.getUsers);

app.get('/v1/users/:id', users.specificUser);

app.get('/v1/bike', scooters.getScooters);

app.get('/v1/bike/:id', scooters.getOneScooter);

app.get('/v1/bike/available', scooters.getAvailable);

app.get('/v1/bike/:id/:available', scooters.updateAvailable);

app.get('/v1/stations', stations.getStations);

app.get('/v1/stations/:id', stations.getOneStation);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});