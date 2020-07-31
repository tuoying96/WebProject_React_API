var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5')
const {UserModel, ChatModel} = require('../db/models')
const filter = {password: 0, __v: 0} // specify attribute to be filtered

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// The Router of Register
router.post('/register', function (req, res) {
  // get data from request body
  const {username, password, sex} = req.body

  UserModel.findOne({username}, function (err, user) {
    // if user exists
    if(user) {
      // return err message
      res.send({code: 1, msg: 'The user has been existed'})
    } else {
      // save the user
      new UserModel({username, sex, password:md5(password)}).save(function (error, user) {

        // 生成一个cookie(userid: user._id), browser keep the cookie
        res.cookie('userid', user._id, {maxAge: 1000*60*60*24}) //save for one day
        // return json
        const data = {username, sex, _id: user._id} // without password
        res.send({code: 0, data})
      })
    }
  })
})

// The Router of Login
router.post('/login', function (req, res) {
  const {username, password} = req.body
  // query users by username and password
  UserModel.findOne({username, password:md5(password)}, filter, function (err, user) {
    if(user) { // login successful
      // generate cookie(userid: user._id), browser keep the cookie
      res.cookie('userid', user._id, {maxAge: 1000*60*60*24}) //save for one day
      // return login information
      res.send({code: 0, data: user})
    } else {// fail to login
      res.send({code: 1, msg: 'username or password is invalid!'})
    }
  })
})

// Router of updating user information
router.post('/update', function (req, res) {
  // get userid from cookie
  const userid = req.cookies.userid
  // if the userid not exists
  if(!userid) {
    return res.send({code: 1, msg: 'Please log in!'})
  }
  // if exists
  // get the information of the user
  const user = req.body // without _id
  UserModel.findByIdAndUpdate({_id: userid}, user, function (error, oldUser) {

    if(!oldUser) {
      // delete userid cookie
      res.clearCookie('userid')
      res.send({code: 1, msg: 'Please log in!'})
    } else {
      // get user object returned
      const {_id, username, sex} = oldUser
      const data = Object.assign({_id, username, sex}, user)
      res.send({code: 0, data})
    }
  })
})

// Router of getting user information
router.get('/user', function (req, res) {
  // get userid from cookie
  const userid = req.cookies.userid
  // if the userid not exists
  if(!userid) {
    return res.send({code: 1, msg: 'Please log in!'})
  }
  // get the information of the user
  UserModel.findOne({_id: userid}, filter, function (error, user) {
    if(user) {
      res.send({code: 0, data: user})
    } else {
      // delete userid cookie
      res.clearCookie('userid')
      res.send({code: 1, msg: 'please log in!'})
    }
  })
})

module.exports = router;
