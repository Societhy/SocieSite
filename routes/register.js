/**
 * Created by Roman on 09/02/2016.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('register.hbs');
});

module.exports = router;