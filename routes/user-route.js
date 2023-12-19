const express = require('express');
const userController = require('../controllers/user');

const router = express.Router();

router.get('/', userController.getAllUsers);
router.post('/', userController.signUp);

module.exports = router;