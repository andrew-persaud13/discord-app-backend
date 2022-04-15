const Message = require('../models/message');
const Conversation = require('../models/conversation');
const chatUpdates = require('./updates/chats');

const directMessageHandler = async (socket, data) => {
  try {
    const { userId } = socket.user;
    const { receiverUserId, content } = data;

    //create a new message
    const message = await Message.create({
      content,
      author: userId,
      date: new Date(),
      type: 'DIRECT',
    });

    //find if conversation exist with these two users - if not create new one
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverUserId] },
      type: 'DIRECT',
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId, receiverUserId],
        messages: [message._id],
      });
    } else {
      conversation.messages.push(message);
      await conversation.save();
    }

    // real time update for chat
    chatUpdates.updateChatHistory(conversation._id.toString());
  } catch (error) {
    console.log(error);
  }
};

module.exports = directMessageHandler;
