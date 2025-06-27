var express = require('express');
const { addYajmaYadi } = require('../controllers/add_yajman_yadi');
const { getYajmanYadi } = require('../controllers/get_yajman_yadi');
const { admin_singup } = require('../controllers/singup/admin_singup');
const { admin_login } = require('../controllers/singup/admin_login');
var router = express.Router();

/* GET users listing. */
router.post('/add-yajman-yadi', addYajmaYadi);
router.get('/get-yajman-yadi', getYajmanYadi);
router.post('/admin-singup', admin_singup);
router.post('/admin-login', admin_login);

module.exports = router;