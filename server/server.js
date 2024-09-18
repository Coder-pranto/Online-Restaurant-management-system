const app = require("./app");
const colors = require("colors");
const dbConnection = require("./utils/dbConnect");
const http = require("http");
const socketIO = require("socket.io");
const realTimeOrderProcessWithSocketIo = require("./utils/realTimeOrderProcess");
// require("dotenv").config();

const server = http.createServer(app);
const PORT = process.env.PORT || 5005;

const startServer = async () => {
  try {
    const dbconnect = await dbConnection();
    if (dbconnect.success === true) {
      console.log(dbconnect.message);

      // Attach Socket.io to the server
      const io = socketIO(server,{
        cors: {
          origin: '*',
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
        },
      });

      // order related socket io functionality
      realTimeOrderProcessWithSocketIo(io);

      // listing the server
      server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}/`.bgWhite.underline.red);
      });
    }
  } catch (error) {
    console.error("Error! ", error.message);
  }
};

startServer();

process.on("unhandledRejection", (error) => {
  console.error(error.name, error.message);

  // Gracefully close the server
  server.close(() => {
    console.log("Server is closed.");
    process.exit(1);
  });
});
