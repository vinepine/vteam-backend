const express = require('express')

const scooterRoutes = require('./src/routes/scooters.js');
const stationRoutes = require('./src/routes/stations.js');
const userRoutes = require('./src/routes/users.js');
const rentalRoutes = require('./src/routes/rentals.js');
const paymentRoutes = require('./src/routes/payments.js');

const app = express();

const port = process.env.PORT || 3001;

app.use(scooterRoutes);
app.use(stationRoutes);
app.use(userRoutes);
app.use(rentalRoutes);
app.use(paymentRoutes);



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
