var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var DeviceData = require('./../models/model');


router.get('/', function(req, res, next) {
    res.send("Hello API");
    res.end();
    next();
});

router.get('/listDevices', function(req, res, next) {
    console.log("List devices");
    (DeviceData.find);
    console.log(DeviceData.find());
    res.send('Hi');
    res.end();
    next();
});

module.exports = router;