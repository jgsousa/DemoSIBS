var express = require('express');
var router = express.Router();
var https = require('https');
var querystring = require('querystring');

var getResult = function(id, callback){
    var path='/v1/checkouts/' + id + '/payment';
    path += '?authentication.userId=8a8294185332bbe60153375476c31527'
    path += '&authentication.password=G5wP5TzF5k'
    path += '&authentication.entityId=8a8294185332bbe601533754724914d9'
    var options = {
        port: 443,
        host: 'test.oppwa.com',
        path: path,
        method: 'GET',
    };
    var postRequest = https.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            jsonRes = JSON.parse(chunk);
            return callback(jsonRes);
        });
    });
    postRequest.end();
};

/* GET home page. */
router.get('/', function(req, noderes, next) {
    var path='/v1/checkouts';
    var data = querystring.stringify( {
        'authentication.userId' : '8a8294185332bbe60153375476c31527',
        'authentication.password' : 'G5wP5TzF5k',
        'authentication.entityId' : '8a8294185332bbe601533754724914d9',
        'amount' : '00.10',
        'currency' : 'EUR',
        'paymentType' : 'DB'
    });
    var options = {
        port: 443,
        host: 'test.oppwa.com',
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': data.length
        }
    };
    var postRequest = https.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            jsonRes = JSON.parse(chunk);
            noderes.render('index', {checkoutId: jsonRes.id});
        });
    });
    postRequest.write(data);
    postRequest.end();
});

router.get('/summary', function(req, res, next) {
    var id = req.query.checkoutId;
    res.render('summary', { checkoutId: id  });
});

router.get('/result', function(req, res, next) {
    var id = req.query.id;
    getResult(id, function(data){
        res.render('result', { result : data.result.description });
    });
});



module.exports = router;
