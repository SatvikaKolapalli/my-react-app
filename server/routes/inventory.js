var router = require("express").Router();
const inventoryController = require('../controllers/inventoryController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/addItem', inventoryController.addItem);
router.get('/getItems', inventoryController.getItems);
router.get('/getItem', inventoryController.getItem);
router.post('/uploadImage', upload.single('image'), inventoryController.uploadImageToS3);
router.put('/updateItem', inventoryController.updateItem);
router.delete('/deleteItem', inventoryController.deleteItem);

module.exports = router;
