const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(403).send('Not authorized.');
  }

  token = token.split(' ')[1]; // 'Bearer token' -> [Bearer, token]

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
  } catch (err) {
    return res.status(401).send('Not authorized.');
  }

  next();
};

module.exports = verifyToken;
