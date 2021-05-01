const express = require('express');
const router = express.Router();
const multer = require('multer');


// Controller callbacks
const { CREATE, READ, DELETE } = require('../Controllers/images');
const { VerifyJWT } = require('../Controllers/auth');

router.post('/newImage', multer({ dest: 'temp/' }).single('image'), VerifyJWT, CREATE);
router.get('/getImage', VerifyJWT, READ);
router.delete('/deleteImage', VerifyJWT, DELETE);

module.exports = router;
