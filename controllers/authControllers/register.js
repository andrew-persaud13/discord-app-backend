const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');

//joi validated the fields already
module.exports = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const userExists = await User.exists({ email });

    if (userExists) {
      return res.status(409).send('Email already in use.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      username,
    });

    const token = jwt.sign(
      { userId: user._id, email },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h',
      }
    );

    return res.status(201).json({
      userDetails: {
        email,
        token,
        username,
        _id: user._id,
      },
    });
  } catch (err) {
    return res.status(500).send('Error happened. Try again.');
  }
};

/*
-check if email taken
-hash password
-create user
- create token
-return { user, token }
*/
