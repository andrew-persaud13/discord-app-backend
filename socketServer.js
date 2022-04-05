const authSocket = require('./middleware/authSocket');
const newConnectionHandler = require('./socketHandlers/newConnectionHandler');
const disconnectHandler = require('./socketHandlers/disconnectHandler');
const serverStore = require('./serverStore');

const registerSocketServer = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  serverStore.setSocketServerInstance(io);

  //socket has jwt, verify it. put user on socket
  io.use(authSocket);

  io.on('connection', (socket) => {
    console.log('user connected');
    console.log(socket.id);

    newConnectionHandler(socket, io); // send events in here on startup

    socket.on('disconnect', () => {
      disconnectHandler(socket);
    });
  });
};

module.exports = {
  registerSocketServer,
};
