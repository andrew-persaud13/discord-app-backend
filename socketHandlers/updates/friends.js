const User = require('../../models/user');
const FriendInvitation = require('../../models/friendInvitation');
const serverStore = require('../../serverStore');

const updateFriendsPendingInvitations = async (userId) => {
  try {
    const pendingInvitations = await FriendInvitation.find({
      receiverId: userId,
    }).populate('senderId', '_id username email');

    const activeSockets = serverStore.getActiveSocketsForUser(userId);
    const io = serverStore.getSocketServerInstance();

    activeSockets.forEach((socketId) =>
      io.to(socketId).emit('friends-invitations', {
        pendingInvitations: pendingInvitations ? pendingInvitations : [],
      })
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = { updateFriendsPendingInvitations };
