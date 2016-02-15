/**
 * Created by Roman on 09/02/2016.
 */
var express = require('express');
var router = express.Router();
var db = require('../db')

router.get('/:name', function(req, res, next)
{
    db.getOrgaByName(req.param.name, function (orga)
    {
        res.render('organisation', {name: orga.name, memberList: orga.memberList,  });
        return
    });
    // TODO - 404 !
});
module.exports = router;
