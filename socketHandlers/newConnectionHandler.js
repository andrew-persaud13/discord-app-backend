const serverStore = require('../serverStore');
const friendsUpdates = require('../socketHandlers/updates/friends');

const newConnectionHandler = async (socket, io) => {
  const userDetails = socket.user; //user was put on in middleware to verify token

  serverStore.addNewConnectedUser({
    socketId: socket.id,
    userId: userDetails.userId,
  });

  // update pending invitations list
  friendsUpdates.updateFriendsPendingInvitations(userDetails.userId);
};

module.exports = newConnectionHandler;
