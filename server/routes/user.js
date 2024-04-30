var router = require("express").Router();
const userController = require('../controllers/userController');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/getUserInfo', userController.getUserInfo);
router.put('/updateUser', userController.update);
router.delete('/deleteUser', userController.delete);

module.exports = router;
