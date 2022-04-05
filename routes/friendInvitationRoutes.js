const express = require('express');
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});

const authorized = require('../middleware/auth');
const { friendInvite } = require('../controllers/friendInviteControllers');

const router = express.Router();

const invitationSchema = Joi.object({
  targetEmail: Joi.string().email().required(),
});

router.post(
  '/invite',
  authorized,
  validator.body(invitationSchema),
  friendInvite
);

module.exports = router;
