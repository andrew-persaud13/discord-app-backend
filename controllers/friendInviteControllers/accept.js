const FriendInvitation = require('../../models/friendInvitation');
const User = require('../../models/user');
const friendsUpdates = require('../../socketHandlers/updates/friends');
module.exports = async (req, res) => {
  try {
    const { id } = req.body;
    const { userId } = req.user;

    const invitation = await FriendInvitation.findById(id);

    if (!invitation) {
      return res.status(404).send('Error occured. Please try again');
    }

    const { senderId } = invitation;

    //add friends to both users
    const receiverUser = await User.findById(userId); //logged in user
    const senderUser = await User.findById(senderId); //user whose request we are accepting

    receiverUser.friends = [...receiverUser.friends, senderUser];
    senderUser.friends = [...senderUser.friends, receiverUser];

    await receiverUser.save();
    await senderUser.save();

    //delete invitation
    await FriendInvitation.findByIdAndDelete(id);

    //update list if users are online

    //update list of pending invitations
    friendsUpdates.updateFriendsPendingInvitations(senderId);
    friendsUpdates.updateFriendsPendingInvitations(userId);

    res.status(201).send('Accepted');
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send('Something went wrong. Please try again later.');
  }
};
