/*1. connect database*/
// 1.1. import mongoose
const mongoose = require('mongoose')
// 1.2. connect specific database
mongoose.connect(process.env.PORT, {dbName: 'fatefour'});
// 1.3. get connection object
const conn = mongoose.connection
// 1.4. combine listener
conn.on('connected', () => {
    console.log('db connect success!')
})

/*2. get Model*/
// 2.1. Schema
const userSchema = mongoose.Schema({
    username: {type: String, required: true}, 
    password: {type: String, required: true}, 
    sex: {type: String, required: true}, 
    header: {type: String}, // header
    zipcode: {type: String}, // zipcode
    info: {type: String}, // introduction
    location: {type: String}, // prefer location
    rent: {type: String} // rent
})
// 2.2. define Model
const UserModel = mongoose.model('user', userSchema) // collection: users
// 2.3. export Model
exports.UserModel = UserModel