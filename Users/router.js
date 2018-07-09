var express = require('express');
var app = express();
var router = express.Router();
var path = require("./../paths");
var bodyParser = require('body-parser');
var controllers = require("./controllers");

router.post("/login" , bodyParser.urlencoded({ extended: false }), function(req,res){
    var requestBody = req.body;
    controllers.findUser(requestBody , function(err,result){
        if(err){
            console.log(err);
        } else {
            res.send(result);
        }
    });
})

router.post("/signup" ,bodyParser.urlencoded({ extended: false }), function(req,res){
    var requestBody = req.body;
    controllers.create(requestBody , function(err,result){
        if(err){
            console.log(err);
        } else {
            res.send(result);
        }
    });
})

module.exports = router;