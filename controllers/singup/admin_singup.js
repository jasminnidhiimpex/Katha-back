const bcrypt = require('bcrypt');
const db = require('../../model/connection');
const logger = require('../../logger');


exports.admin_singup = (req, res) => {
  const { email, password, confirmPassword } = req.body;

  try {
    if (!email || !password || !confirmPassword) {
      logger.error("All fields are required");
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      logger.error("Passwords do not match");
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    db.query(`SELECT * FROM admin_users WHERE email = ?`, [email], async (err, results) => {
      if (err) {
        logger.error("Error getting email",err);
        return res.status(500).json({ message: 'Error getting email', error:err.message });
      }

      if (results.length > 0) {
        logger.error("Email already registered");
        return res.status(400).json({ message: 'Email already registered' });
      }

      const hash = await bcrypt.hash(password, 10);

      db.query(`INSERT INTO admin_users (email, password_hash) VALUES (?, ?)`,
        [email, hash],(err, result) => {
          if (err) {
            logger.error("Error inserting admin_users",err);
            return res.status(500).json({ message: 'Error inserting admin_users',error:err.message });
          }
          res.status(201).json({ message: 'Admin registered successfully' });
        }
      );
    }); 
  } catch (error) {
    logger.error("Error in admin_singup",error);
    res.status(500).json({
      message: "Error in admin_singup",
      error: err.message
    });
  }
};