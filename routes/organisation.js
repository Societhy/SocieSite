/**
 * Created by Roman on 09/02/2016.
 */
var express = require('express');
var router = express.Router();
var db = require('../db')

router.get('/', function (req, res, next)
{
res.render('organisation_homepage')
})

router.get('/:name', function(req, res, next)
{
    db.getOrgaByName(req.params.name, function (isOrga, orga)
    {
        if (isOrga)
        {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
            return;
        }
        res.render('organisation', {name: orga.name, memberList: orga.memberList,  });
    });
});
module.exports = router;
