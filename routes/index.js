var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var user = require('../model/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '登录' });
});

router.post('/', function(req, res, next) {
  var name = req.body.name;
  var password = req.body.password;

  if(password==='' && name ===''){//假如传递过来的name和password为空
    res.render('index', { title: '发生错误',name:'请输入用户名和密码' });//路由则传递相关错误信息
  }

  user.findOne({ name:name,password:password },function (err, doc) {
    if (err) return next(err);
        if(doc){
            res.render('index', { title: '登录成功',name:name });
        }else{
            res.render('index',{title:'发生错误',name:'请检查您的用户名及密码'});
        }
  });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: '用户注册' });
});

router.post('/register', function(req, res, next) {
  var name = req.body.name;
  var password = req.body.password;


  user.create({ // 创建一组user对象置入model
      name: name,
      password: password
  }, function (err, doc) {
      if (err) {
          res.send(500);
          console.log(err);
      } else {
          res.render('index', {title: '注册成功', name: name, password: password});
          //res.send(200);
      }
  });
});
module.exports = router;
