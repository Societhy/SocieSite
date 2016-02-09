/**
 * Created by Roman on 09/02/2016.
 */
var express = require('express');
var router = express.Router();

router.get('/:id', function(req, res, next) {
    console.log(req.param.id)
    res.render('index', { title: req.param.id });
});

module.exports = router;