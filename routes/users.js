var express = require('express');
const { addYajmaYadi } = require('../controllers/yajman_yadi/add_yajman_yadi');
const { getYajmanYadi } = require('../controllers/yajman_yadi/get_yajman_yadi');
const { admin_singup } = require('../controllers/singup/admin_singup');
const { admin_login } = require('../controllers/singup/admin_login');
const { deleteYajmaYadi } = require('../controllers/yajman_yadi/delete_yajman_yadi');
const { updateYajmaYadi } = require('../controllers/yajman_yadi/update_yajman_yadi');
var router = express.Router();

/* GET users listing. */
router.post('/add-yajman-yadi', addYajmaYadi);
router.get('/get-yajman-yadi', getYajmanYadi);
router.put('/delete-yajman-yadi', deleteYajmaYadi);
router.put('/update-yajman-yadi', updateYajmaYadi);


router.post('/admin-singup', admin_singup);
router.post('/admin-login', admin_login);

module.exports = router;