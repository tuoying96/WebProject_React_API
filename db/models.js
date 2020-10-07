require('dotenv').config()
/*1. connect database*/
// 1.1. import mongoose
const mongoose = require('mongoose')

// 1.2. connect specific database
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
// 1.3. get connection object
const conn = mongoose.connection
// 1.4. combine listener
conn.on('connected', () => {
    console.log('db connect success!')
})



/*2. get Model*/
// 2.1. define user Schema
const userSchema = mongoose.Schema({
    username: {type: String, required: true}, 
    password: {type: String, required: true}, 
    sex: {type: String, enum: ['male', 'female', 'non-binary'], required: true, lowercase: true},
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true
    },
    header: {type: String}, // header
    zipcode: {type: String}, // zipcode
    info: {type: String}, // introduction
    location: {type: String}, // prefer location
    rent: {type: String}, // rent
    housestyle: {type: String} // housestyle
  })

exports.UserModel = mongoose.model('user', userSchema) // collection: users



// define chat Schema
const chatSchema = mongoose.Schema({
    from: {type: String, required: true}, // sender id
    to: {type: String, required: true}, // reciever id
    chat_id: {type: String, required: true}, // chat id, a string combined with 'from' and 'to'
    content: {type: String, required: true}, // content
    read: {type:Boolean, default: false}, // flag, if read or not
    create_time: {type: Number} // creating time
  })

// export Model
exports.ChatModel = mongoose.model('chat', chatSchema) // collection: chats
