const mongoose = require('mongoose');
const { Schema } = mongoose;

const friendInvitationSchema = Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('FriendInvitation', friendInvitationSchema);
