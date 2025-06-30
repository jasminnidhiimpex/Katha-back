const logger = require("../../logger");
const db = require("../../model/connection");
const bcrypt = require('bcrypt');


exports.forgetPassword = (req, res) => {
  const { email, password_hash, confirmPassword } = req.body;

  // Check if user exists
  const selectQuery = `SELECT id FROM admin_users WHERE email = ?`;
  db.query(selectQuery, [email], async (err, result) => {
    if (err) {
      logger.error(`Database error while checking user '${email}': ${err.message}`);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (result.length === 0) {
      logger.info(`Forget password_hash attempt: User '${email}' not found`);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    try {
      // Hash the new password_hash
      const hashedPassword = await bcrypt.hash(password_hash, 10);

      // Update the password_hash
      const updateQuery = `UPDATE admin_users SET password_hash = ? WHERE email = ?`;
      db.query(updateQuery, [hashedPassword, email], (updateErr, updateResult) => {
        if (updateErr) {
          logger.error(`Password update failed for user '${email}': ${updateErr.message}`);
          return res.status(500).json({ success: false, message: "Failed to update password_hash" });
        }

        logger.info(`Password updated successfully for user '${email}'`);
        return res.json({ success: true, message: "Password updated successfully" });
      });
    } catch (hashError) {
      logger.error(`Bcrypt error while hashing password_hash for '${email}': ${hashError.message}`);
      return res.status(500).json({ success: false, message: "Error hashing password" });
    }
  });
};