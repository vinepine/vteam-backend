const express = require("express");
const cors = require("cors");
const http = require("http");
const initSocket = require("./socket/socket");

const scooterRoutes = require("./src/routes/scooters.js");
const stationRoutes = require("./src/routes/stations.js");
const userRoutes = require("./src/routes/users.js");
const rentalRoutes = require("./src/routes/rentals.js");
const paymentRoutes = require("./src/routes/payments.js");
const cityRoutes = require("./src/routes/city.js");

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));

const server = http.createServer(app);

initSocket(server);

const port = process.env.PORT || 3001;

app.use(scooterRoutes);
app.use(stationRoutes);
app.use(userRoutes);
app.use(rentalRoutes);
app.use(paymentRoutes);
app.use(cityRoutes);

server.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
