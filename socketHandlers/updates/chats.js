const Conversation = require('../../models/conversation');
const serverStore = require('../../serverStore');

const updateChatHistory = async (conversationId, socketId = null) => {
  const conversation = await Conversation.findById(conversationId).populate({
    path: 'messages',
    model: 'Message',
    populate: {
      path: 'author',
      model: 'User',
      select: 'username _id',
    },
  });

  // const activeSockets = serverStore.getActiveSocketsForUser(userId);
  const io = serverStore.getSocketServerInstance();

  if (socketId) {
    return io.to(socketId).emit('direct-chat-history', {
      messages: conversation.messages,
      participants: conversation.participants,
    });
  }

  //check if users of this conversation are online
  //if yes, emit to them update of messages

  conversation.participants.forEach((userId) => {
    const activeSockets = serverStore.getActiveSocketsForUser(
      userId.toString()
    );

    activeSockets.forEach((socket) => {
      io.to(socket).emit('direct-chat-history', {
        messages: conversation.messages,
        participants: conversation.participants,
      });
    });
  });
};

module.exports = { updateChatHistory };
