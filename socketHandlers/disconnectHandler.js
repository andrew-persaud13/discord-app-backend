const serverStore = require('../serverStore');

const disconnectHandler = (socket) => serverStore.removeUser(socket.id);

module.exports = disconnectHandler;
