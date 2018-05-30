const request = require('superagent');
const cheerio = require('cheerio');
const async = require("async");

var doSubmit = function (userInfo, logArray,res) {
    //登录用
    const agent = request.agent();
    agent
        .post('http://123.57.153.248/amb/loginAction.aspx')
        .type('form')
        .send({ username: userInfo.username, password: userInfo.password })
        .end(function (err, sres1) {
            // 常规的错误处理
            if (err) {
                return next(err);
            }
            if(sres1.text.indexOf("用户名或密码不对")>0){
                res.json( {returnMsg:'用户名或密码不对!'});
                return;
            }
            //日志录入界面
            agent
                .get('http://123.57.153.248/amb/ambrzgl/ambrzlr.aspx')
                .end(function (err, sres2) {
                    console.log("sres2.status:" + sres2.status);
                    // 常规的错误处理
                    if (err) {
                        return next(err);
                    }
                    const $ = cheerio.load(sres2.text)
                    var __VIEWSTATE = $('[name=form1]').find('[name=__VIEWSTATE]').val();
                    var __VIEWSTATEGENERATOR = $('[name=form1]').find('[name=__VIEWSTATEGENERATOR]').val();
                    var __EVENTVALIDATION = $('[name=form1]').find('[name=__EVENTVALIDATION]').val();


                    async.mapLimit(logArray,5,function(logObj,callback){

                        var obj = {
                            __VIEWSTATE: __VIEWSTATE,
                            __VIEWSTATEGENERATOR: __VIEWSTATEGENERATOR,
                            __EVENTVALIDATION: __EVENTVALIDATION,
                            ButtonSave: '保存',
                            TextBoxRq: logObj.TextBoxRq,
                            Repeater1$ctl01$HiddenFieldXmdm: '117',
                            Repeater1$ctl01$HiddenFieldCheckState: logObj.TextBoxxmnr == ""?'|':'|3|4|5|6|7|8|9|10|11|',
                            TextBoxxmnr: logObj.TextBoxxmnr
                        }
                        agent
                        .post('http://123.57.153.248/amb/ambrzgl/ambrzlr.aspx')
                        .type('form')
                        .send(obj)
                        .end(function (err, sres3) {
                            // 常规的错误处理
                            if (err) {
                                return next(err);
                            }
                            callback(null,obj.TextBoxRq + " 日志填写成功");
                        });
                    },function(err,results){
                        console.log("err :");
                        console.log(err);   
                        console.log("result :");
                        console.log(results);   
                        res.json( {returnMsg:results});
                    });
                     

                });
        });
        
}
module.exports = doSubmit;