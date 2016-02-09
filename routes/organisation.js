/**
 * Created by Roman on 09/02/2016.
 */
var express = require('express');
var router = express.Router();

router.get('/:name', function(req, res, next) {
    res.render('organisation', { name: req.params.name});
});

module.exports = router;