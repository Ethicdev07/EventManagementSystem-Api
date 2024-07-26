const express = require('express');
const { signupAdmin, loginAdmin } = require('../controllers/adminController');
const { protectAdminRoute } = require('../middleware/auth');

const router = express.Router();

router.route('/signup').post(signupAdmin);
router.route('/login').post( loginAdmin);

router.get('/dashboard', protectAdminRoute, (req, res) => {
  res.send('Welcome to the admin dashboard');
});

module.exports = router;
