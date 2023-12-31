const express = require('express');
const placeController = require('../controllers/place');

const router = express.Router();

router.get('/', placeController.getAllPlaces);
router.post('/', placeController.createPlace);
router.delete('/:id', placeController.deletePlace);

module.exports = router;