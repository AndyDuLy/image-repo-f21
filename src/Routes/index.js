const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const imagesRoutes = require('./images');


// Endpoints are /{base}/{callback} ie; /auth/signup
router.use('/auth', authRoutes);
router.use('/images', imagesRoutes);

module.exports = router;
