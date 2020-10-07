const {ChatModel} = require('../db/models')
module.exports = function (server) {
    const io = require('socket.io')(server)

    // listen connection between client and server
    io.on('connection', function (socket) {
      console.log('socketio connected')

      // a specific connection
      socket.on('sendMsg', function ({from, to, content}) {
        console.log('The server receives the message sent by the client:', {from, to, content})
        //prepare chat data
        const chat_id = [from, to].sort().join('_')
        const create_time = Date.now()
        //save message
        new ChatModel({from, to, content, chat_id, create_time}).save(function(error, chatMsg) {
            //send message
            io.emit('receiveMsg', chatMsg)//all client
        })
      })
    })
  }