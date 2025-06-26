var express = require('express');
const { addYajmaYadi } = require('../controllers/add_yajman_yadi');
var router = express.Router();

/* GET users listing. */
router.post('/add-yajman-yadi', addYajmaYadi);

module.exports = router;