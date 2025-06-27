const bcrypt = require('bcrypt');
const db = require('../../model/connection');

exports.admin_singup = (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  db.query('SELECT * FROM admin_users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error' });

    if (results.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hash = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO admin_users (email, password_hash) VALUES (?, ?)',
      [email, hash],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Insert error' });
        res.status(201).json({ message: 'Admin registered successfully' });
      }
    );
  });
};
