const connectedUsers = new Map();

let io = null;

const setSocketServerInstance = (IoInstance) => (io = IoInstance);

const getSocketServerInstance = () => io;

const addNewConnectedUser = ({ socketId, userId }) => {
  connectedUsers.set(socketId, { userId });
  console.log('New user added to map');
  console.log(connectedUsers);
};

const removeUser = (socketId) => {
  if (connectedUsers.has(socketId)) {
    connectedUsers.delete(socketId);
    console.log('User removed from map');
  }
};

const getActiveSocketsForUser = (userId) => {
  const activeConnections = [];
  connectedUsers.forEach((value, key) => {
    if (value.userId === userId) activeConnections.push(key);
  });
  return activeConnections;
};

module.exports = {
  setSocketServerInstance,
  getSocketServerInstance,
  addNewConnectedUser,
  removeUser,
  getActiveSocketsForUser,
};
