/**
 * Created by Roman on 09/02/2016.
 */
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../db')

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', function(req, res, next)
{
    res.render('register.hbs');
});

var inser
router.post('/submit', urlencodedParser, function (req, res)
{
    // Prepare output in JSON format
    var response = {
        firstname:req.body.username,
        addresses:[req.body.ethaddr]
    };

    db.existUser(response,
        //CALLBACK EXIST
        function ()
        {
            db.insertNewUser(function(error)
            {
                if (!error)
                {
                    //OK
                    return;
                }
                else
                {
                    // ERROR !
                    return;
                }
            })
        },
        //CALLBACK NOT EXIST
        function ()
        {
        }
    );

    console.log(response);
    res.end(JSON.stringify(response));
});


module.exports = router;