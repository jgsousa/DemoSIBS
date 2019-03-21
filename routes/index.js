var express = require('express');
var router = express.Router();
var https = require('https');
var querystring = require('querystring');

var sibsHost = process.env.SIBSHOST || "test.oppwa.com";
var sibsEntityId = process.env.SIBSENTITYID || "8ac7a4c966aaa1f20166abf7b69d043f";
var sibsPassword = process.env.SIBSPASSWORD || "Rr47eQesdW";
var sibsUserId = process.env.SIBSUSERID || "8a8294185b674555015b7c1928e81736";
var sibsPaymentEntity = process.env.SIBSPAYMENTENTY || "25002";

var getInitialDate = function(){
    let date = new Date().toISOString();
    return date.replace("Z","+01:00");
};

var getExpireDate = function(days){
    let date = new Date();
    date.setTime(date.getTime() + days * 86400000 );
    return date.toISOString().replace("Z","+01:00");
};

var getReference = function(amount, firstName, lastName, transactionId, callback){

    var path='/v1/payments';

    var data = querystring.stringify({
        'authentication.userId': sibsUserId,
        'authentication.entityId': sibsEntityId,
        'authentication.password': sibsPassword,
        'amount': amount,
        'currency': 'EUR',
        'paymentType': 'PA',
        'paymentBrand': 'SIBS_MULTIBANCO',
        'merchantTransactionId': transactionId,
        'customParameters[SIBSMULTIBANCO_PtmntEntty]': sibsPaymentEntity,
        'customParameters[SIBSMULTIBANCO_RefIntlDtTm]': getInitialDate(),
        'customParameters[SIBSMULTIBANCO_RefLmtDtTm]': getExpireDate(3),
        'customer.ip': '123.123.123.123',
        'customer.surname': lastName,
        'customer.givenName': firstName,
        'billing.country': 'PT',
        'shopperResultUrl': 'https://test/'
    });

    var options = {
        port: 443,
        host: sibsHost,
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
            return callback(jsonRes.resultDetails);
        });
    });
    postRequest.write(data);
    postRequest.end();
};

/* GET home page. */
router.get('/', function(req, noderes, next) {
    noderes.render('index', {});
});

router.post('/generateatm', function(req, res, next) {
    var body = req.body;
    getReference(body.referenceValue, body.firstName, body.lastName,
        body.ordem, function(data){
            res.json(data)
    });
});

module.exports = router;
