const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');

//joi validated the fields already
module.exports = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(409).send('invalid credentials');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(409).send('Invalid credentials');
    }

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
        username: user.username,
        _id: user._id,
      },
    });
  } catch (err) {
    return res.status(500).send('Error happened. Try again.');
  }
};

/*
-check if email valid by getting user
- compare plain text pw to hashed
-create token
-return { user, token }
*/
