var express = require('express');
const { addYajmaYadi } = require('../controllers/add_yajman_yadi');
const { getYajmanYadi } = require('../controllers/get_yajman_yadi');
var router = express.Router();

/* GET users listing. */
router.post('/add-yajman-yadi', addYajmaYadi);
router.get('/get-yajman-yadi', getYajmanYadi);

module.exports = router;