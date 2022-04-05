const FriendInvitation = require('../../models/friendInvitation');
const friendsUpdates = require('../../socketHandlers/updates/friends');

module.exports = async (req, res) => {
  try {
    const { id } = req.body;
    const { userId } = req.user;

    //remove invitation from invitations collection
    const invitationExists = await FriendInvitation.exists({ _id: id });

    if (invitationExists) {
      await FriendInvitation.findByIdAndDelete(id);
    }
    console.log('here');
    //update pending invitations
    friendsUpdates.updateFriendsPendingInvitations(userId);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Something went wrong. Please try again.');
  }
};
