const crypto = require('crypto');

module.exports = (req, res, next) => {
  if (req.body.studentId) {
    req.encryptedId = crypto.createHash('sha256').update(req.body.studentId).digest('hex');
  }
  next();
};
