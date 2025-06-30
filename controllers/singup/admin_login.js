const db = require('../../model/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../../logger');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

exports.admin_login = (req, res) => {
  const { email, password } = req.body;

  try {
    db.query(`SELECT * FROM admin_users WHERE email = ?`, [email], async (err, results) => {
      if (err) {
        logger.error('Error fetching admin_users email:', err);
        return res.status(500).json({ message: 'Error fetching admin_users email', error:err.message });
      }
  
      if (results.length === 0) {
        logger.error()
        return res.status(401).json({ message: 'No email found' });
      }
  
      const user = results[0];
  
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        logger.error("Invalid email or password");
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '2h' }
      );
  
      res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, email: user.email }
      });
    });
  } catch (error) {
    logger.error("Error in admin_login",error);
    res.status(400).json({
      message: "Error in admin_login",
      error: err.message
    })  
  }
};