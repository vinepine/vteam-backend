const express = require('express');

const scooterRoutes = require('./src/routes/scooters.js');
const stationRoutes = require('./src/routes/stations.js');
const userRoutes = require('./src/routes/users.js');
const rentalRoutes = require('./src/routes/rentals.js');
const authRoutes = require('./src/routes/auth.js');
const paymentRoutes = require('./src/routes/payments.js');
const cityRoutes = require('./src/routes/city.js');

const app = express();

const port = process.env.PORT || 3001;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(scooterRoutes);
app.use(stationRoutes);
app.use(userRoutes);
app.use(rentalRoutes);
app.use(paymentRoutes);
app.use(cityRoutes);
app.use(authRoutes);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;
