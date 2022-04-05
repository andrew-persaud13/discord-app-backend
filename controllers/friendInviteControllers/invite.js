const User = require('../../models/user');
const FriendInvitation = require('../../models/friendInvitation');
const friendsUpdates = require('../../socketHandlers/updates/friends');

module.exports = async (req, res) => {
  const { targetEmail } = req.body;

  const { userId, email } = req.user;

  //check not sending to yourself
  if (email.toLowerCase() === targetEmail.toLowerCase()) {
    return res.status(409).send('Cannot invite yourself.');
  }

  //check target user exists
  const targetUser = await User.findOne({ email: targetEmail.toLowerCase() });

  if (!targetUser) {
    return res.status(404).send('That user does not exist.');
  }

  //check no invitation sent already
  const invitationAlreadySent = await FriendInvitation.findOne({
    senderId: userId,
    receiverId: targetUser._id,
  });

  if (invitationAlreadySent) {
    return res.status(409).send('Invitation already sent!');
  }

  // make sure not already friends
  const usersAlreadyFriends = targetUser.friends.some(
    (friend) => friend.toString() === userId.toString()
  );

  if (usersAlreadyFriends) {
    return res.status(409).send('Already friends with this user.');
  }

  await FriendInvitation.create({
    senderId: userId,
    receiverId: targetUser._id,
  });

  //send pending invitations update to specific user
  friendsUpdates.updateFriendsPendingInvitations(targetUser._id.toString());

  return res.status(201).send('Good.');
};
