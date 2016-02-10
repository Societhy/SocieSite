/**
 * Created by Roman on 09/02/2016.
 */
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', function(req, res, next)
{
    res.render('register.hbs');
});

router.post('/submit', urlencodedParser, function (req, res)
{
    // Prepare output in JSON format
    var response = {
        username:req.body.username,
        password:req.body.password,
        country:req.body.country
    };
    console.log(response);
    res.end(JSON.stringify(response));
});
module.exports = router;