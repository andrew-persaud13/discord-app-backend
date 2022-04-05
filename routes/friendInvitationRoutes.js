const express = require('express');
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});

const authorized = require('../middleware/auth');
const {
  friendInvite,
  acceptInvite,
  rejectInvite,
} = require('../controllers/friendInviteControllers');

const router = express.Router();

const invitationSchema = Joi.object({
  targetEmail: Joi.string().email().required(),
});

const acceptSchema = Joi.object({
  id: Joi.string().required(),
});

router.post(
  '/invite',
  authorized,
  validator.body(invitationSchema),
  friendInvite
);

router.post('/accept', authorized, validator.body(acceptSchema), acceptInvite);

router.post('/reject', authorized, validator.body(acceptSchema), rejectInvite);

module.exports = router;
