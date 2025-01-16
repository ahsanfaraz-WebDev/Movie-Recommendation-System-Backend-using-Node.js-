const jwt = require('jsonwebtoken');
const User = require('../Model/User'); // Assuming you have a User model to fetch the user's role

const auth = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Auth Error' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Invalid Token' });
    }
};

const authAdmin = async (req, res, next) => {
  try {
      const user = await User.findById(req.userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      if (user.role !== 'admin') {
          return res.status(403).json({ message: 'Access denied, admin only' });
      }
      next();
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { auth, authAdmin };
