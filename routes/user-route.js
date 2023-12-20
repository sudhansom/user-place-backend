const express = require('express');
const userController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/', userController.getAllUsers);
router.post('/', userController.signUp);
router.delete('/:id',checkAuth, userController.deleteUser);
router.post('/login', userController.loginUser);

module.exports = router;