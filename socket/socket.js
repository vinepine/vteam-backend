const { Server } = require("socket.io");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
  });

  setInterval(() => {
    io.emit("scooter-update", {
      id: 1,
      lat: 55.6095 + Math.random() * 0.002,
      lng: 13.0005 + Math.random() * 0.002,
    });
  }, 2000);

  return io;
}

module.exports = {
  initSocket,
};
