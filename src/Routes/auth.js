const express = require('express');
const router = express.Router();


// Controller callbacks
const { SIGNUP, LOGIN } = require('../Controllers/auth');

router.post('/signup', SIGNUP);
router.post('/login', LOGIN);

module.exports = router;
