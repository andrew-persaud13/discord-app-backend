const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const { registerSocketServer } = require('./socketServer');

const app = express();
const PORT = process.env.PORT || process.env.API_PORT;

//middlewares
app.use(express.json());
app.use(cors());

//routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use(
  '/api/v1/friend-invitation',
  require('./routes/friendInvitationRoutes')
);

const server = http.createServer(app);
registerSocketServer(server);

//connect to db/server
mongoose.connect(process.env.DB_URI, () => {
  console.log('mongooo');
  server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
});
