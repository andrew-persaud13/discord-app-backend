const express = require('express');
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});

const {
  loginController,
  registerController,
} = require('../controllers/authControllers');

const authorized = require('../middleware/auth');

const router = express.Router();

const regAndLoginSchema = {
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(12).required(),
};

const registerSchema = Joi.object({
  ...regAndLoginSchema,
  username: Joi.string().min(3).max(12).required(),
});

const loginSchema = Joi.object({
  ...regAndLoginSchema,
});

router.post('/register', validator.body(registerSchema), registerController);
router.post('/login', validator.body(loginSchema), loginController);
router.post('/test', authorized, (req, res) => res.send('made it'));
module.exports = router;
