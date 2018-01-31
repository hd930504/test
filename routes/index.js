var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var user = require('../model/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
      title: '首页',
      user:req.session.user,
      success : req.flash('success').toString(),
      error : req.flash('error').toString()
    });
});
 
router.get('/login',function(req, res, next){
  res.render('login',{title:'登录'})
})
router.post('/login', function(req, res, next) {
  var User = req.body;
  if(User.name==='' && User.password ===''){//假如传递过来的name和password为空
    // req.flash('error', '请输入用户名和密码');
    return res.json({error:'请输入用户名和密码'});
  }

  user.findOne({name:User.name},function (err, doc) {
      if (!doc) {
        req.flash('error', '用户不存在');
        return res.json({error:'用户不存在'});
        // return res.redirect('/');
      }
      if (User.password != doc.password) {
        req.flash('error', '密码错误');
        return res.json({error:'密码错误'});
        // return res.redirect('/');
      }
      console.log(doc)
      req.session.user = doc;
      req.flash('success', '登录成功');
      return res.json({success:'登录成功'});
  });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: '注册' });
});

router.post('/register', function(req, res, next) {
  var newUser = new user({
    name:req.body.name,
    password:req.body.password
  });

  if(newUser.name != req.body.rePassword){
    return res.json({error:'密码不一致'})
  }

  user.findOne({name:newUser.name},function(err,doc){
      if(doc) err="用户名已存在";
      if(err){
        return res.json({error:err});
      }

      newUser.save(function(err){
          if(err){
            return res.json({error:err});
          }
          req.session.user = newUser;
          return res.json({success:'注册成功'});
      })
  })
});
module.exports = router;
