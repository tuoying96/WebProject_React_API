module.exports = function (server) {
    const io = require('socket.io')(server)

    // listen connection between client and server
    io.on('connection', function (socket) {
      console.log('socketio connected')

      // a specific connection
      socket.on('sendMsg', function (data) {
        console.log('The server receives the message sent by the clien:', data)
        //process data
        data.name = data.name.toUpperCase()
        // server sends a message to client
        // socket.emit('receiveMsg', data)//current socket, one client
        io.emit('receiveMsg', data)//all client
        console.log('The server sends a message to the client', data)
      })
    })
  }