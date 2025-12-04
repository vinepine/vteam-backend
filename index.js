const express = require('express')
const users = require('./src/routes/users.js');
const stations = require('./src/routes/stations.js');
const app = express();

const port = process.env.PORT || 3001;

app.get('/v1/users', users.getUsers);

app.get('/v1/users/:id', users.specificUser);

app.get('/v1/stations', stations.getStations);

app.get('/v1/stations/:id', stations.getOneStation);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});