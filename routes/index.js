var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5')
const {UserModel, ChatModel} = require('../db/models')
const drop = {password: 0, __v: 0} // specify attribute to be filtered

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Add a new user
router.post('/register', async (req, res) => {

  const userObj = {}

  for(const key in req.body) {
    if(key === "password"){
      userObj[key] = md5(req.body[key])
    } else {
      userObj[key] = req.body[key]
    }
  }

  const filter = {'username': userObj.username}
  const exists = await UserModel.exists(filter);
  
  if(exists) {
    res.send({code: 1, msg: "username has been occupied. Please pick another one"});
  } else {

    const users = new UserModel(userObj);

    try {
      const newUser = await users.save()

      res.cookie('userid', newUser._id), {maxAge: 1000 * 60 * 60}; // store cookies for one hour

      res.send({code: 0, data: {_id: newUser._id, username: newUser.username, sex: newUser.sex, email: newUser.email}})
    } catch (err) {
      res.status(400).json({message: err.message})
    } 
  }

})

// login page
router.post('/login', async (req, res) => {
  const {username, password} = req.body;

  const filter = {username: username, password: md5(password)};

  const user = await UserModel.findOne(filter, drop);

  if(user) {
    res.cookie('userid', user._id), {maxAge: 1000 * 60 * 60}; // store cookies for one hour
    res.send({code: 0, data: user})
  } else {
    res.send({code: 1, msg: 'username or password do not match our records. Please enter again.'})    
  }

})

// Router of updating user information
router.post('/update', async (req, res) => {
  // get userid from cookie
  const userid = req.cookies.userid
  // if the userid not exists
  if(!userid) {
    return res.send({code: 1, msg: 'Please log in!'})
  }
  // if exists
  // get the information of the user
  const user = req.body // without _id
  const oldUser =  await UserModel.findByIdAndUpdate({_id: userid}, user)
  if(!oldUser) {
    // delete userid cookie
    res.clearCookie('userid')
    res.send({code: 1, msg: 'Please log in!'})
  } else {
    // get user object returned
    const {_id, username, sex, email} = oldUser
    const data = Object.assign({_id, username, sex, email}, user)
    res.send({code: 0, data})
  }

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
  UserModel.findOne({_id: userid}, drop, function (error, user) {
    if(user) {
      res.send({code: 0, data: user})
    } else {
      // delete userid cookie
      res.clearCookie('userid')
      res.send({code: 1, msg: 'please log in!'})
    }
  })
})

// Router of getting user list
router.get('/userlist', function (req, res) {
  UserModel.find({}, drop, function (error, users) {
    res.send({code: 0, data: users})
  })
})

/*
get message list of current user
 */
router.get('/msglist', function (req, res) {
  // get userid from cookie
  const userid = req.cookies.userid
  // query all user docs
  UserModel.find(function (err, userDocs) {
    const users = userDocs.reduce((users, user) => {
      users[user._id] = {username: user.username, header: user.header}
      return users
    } , {})
   //query chatMsgs related to the userid
    ChatModel.find({'$or': [{from: userid}, {to: userid}]}, drop, function (err, chatMsgs) {
      // return data containning user information and related message
      res.send({code: 0, data: {users, chatMsgs}})//users:object chatMsgs:array
    })
  })
})

/*
modify message to be read
 */
router.post('/readmsg', function (req, res) {

  const from = req.body.from
  const to = req.cookies.userid
  /*
  update chat data in database
  @param1: query condition
  @param2: Update to the specified object
  @param3: Whether to update multiple items at one time
  @param4: callback
   */
  ChatModel.update({from, to, read: false}, {read: true}, {multi: true}, function (err, doc) {
    console.log('/readmsg', doc)
    res.send({code: 0, data: doc.nModified})
  })
})

module.exports = router;
