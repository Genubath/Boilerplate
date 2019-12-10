const rateLimit = require('express-rate-limit');
const { saveError } = require('./logger');



const resetPWLimiter = rateLimit({
    windowMs: 60 * 1000 * 5, // 5 minute window
    max: 16, // start blocking after 5 requests
    keyGenerator(req) {
      console.log(req);
      if (req.body) {
        return req.body.token;
      }
      return req.ip;
    },
    handler(req, res) {
      saveError(
        null,
        req.ip,
        7,
        `Login attempt limit reached for password reset: ${req.body.email}`
      );
      res
        .status(429)
        .send(
          'Too many reset attempts too quickly.  Limited to 15 per 5 minutes.  Please wait and try again'
        );
    }
  });

  const loginLimiter = rateLimit({
    windowMs: 60 * 1000 * 5, // 5 minute window
    max: 16, // start blocking after 5 requests
    keyGenerator(req) {
      if (req.body) {
        return req.body.email;
      }
      return req.ip;
    },
    handler(req, res) {
      saveError(
        null,
        req.ip,
        7,
        `Login attempt limit reached for email: ${req.body.email}`
      );
      res
        .status(429)
        .send(
          'Too many login attempts too quickly.  Limited to 15 per 5 minutes.  Please wait and try again'
        );
    }
  });

  module.exports = {
    loginLimiter, resetPWLimiter
  };
  