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

const getOnlineUsers = () => {
  const onlineUsers = [];
  for (const [key, value] of connectedUsers.entries()) {
    onlineUsers.push({ socketId: key, userId: value.userId });
  }

  return onlineUsers;
};

module.exports = {
  setSocketServerInstance,
  getSocketServerInstance,
  addNewConnectedUser,
  removeUser,
  getActiveSocketsForUser,
  getOnlineUsers,
};
