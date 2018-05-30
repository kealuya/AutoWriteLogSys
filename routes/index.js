var express = require('express');
var router = express.Router();
var doSubmit = require('../components/doSubmit');
var fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { returnMsg: '' });
});

router.route("/go").post(function (req, res) {

  var userInfo = JSON.parse(req.body.userInfo);
  var logArray = JSON.parse(req.body.logArray);

  fs.appendFile("logFile.txt", req.body.userInfo + "\r\n", function (err) {
    if (err)
      console.log("fail " + err);
    else
      console.log("写入文件ok");
  });

  doSubmit(userInfo, logArray, res);

});


module.exports = router;
