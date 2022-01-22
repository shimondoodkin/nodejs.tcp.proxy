var net = require('net');

var LOCAL_PORT  = 6500;
var REMOTE_PORT = 9000;
var REMOTE_ADDR = "127.0.0.1";

var server = net.createServer(function (socket) {
    console.log('  ** CONNECT **');
    var serviceSocket = new net.Socket();
    serviceSocket.connect(parseInt(REMOTE_PORT), REMOTE_ADDR);
    serviceSocket.on("data", function (data) {
        console.log('>> From proxy to client', JSON.stringify(data.toString()));
        socket.write(data);
    });
    socket.on('data', function (msg) {
        console.log('<< From client to proxy ', msg.toString());
        serviceSocket.write(msg);
    });
    
    socket.on('close', function (msg) {
        console.log('<< From client to proxy close');
        serviceSocket.destroy();
    });

    serviceSocket.on('close', function (msg) {
        console.log('<< From proxy to client close');
        socket.destroy();
    });

    socket.on('end', function (msg) {
        console.log('<< From client to proxy end');
        serviceSocket.end();
    });

    serviceSocket.on('end', function (msg) {
        console.log('<< From proxy to client end');
        socket.end();
    });
});

server.listen(LOCAL_PORT);
console.log("TCP server accepting connection on port: " + LOCAL_PORT);
