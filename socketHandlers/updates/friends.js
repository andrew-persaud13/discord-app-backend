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

const sendUserTheirFriends = async (userId) => {
  //might not be online, no need to send friends
  const activeSockets = serverStore.getActiveSocketsForUser(userId);
  if (activeSockets.length) {
    try {
      const user = await User.findById(userId, { _id: 1, friends: 1 }).populate(
        'friends',
        '_id username email'
      );

      if (user) {
        const io = serverStore.getSocketServerInstance();

        activeSockets.forEach((socketId) =>
          io.to(socketId).emit('friends-list', { friends: user.friends })
        );
      }
    } catch (err) {
      console.log(err);
    }
  }
};

module.exports = { updateFriendsPendingInvitations, sendUserTheirFriends };
