var net = require('net');
var socket_timeout = 5000;

exports.connect = function(port, host) {
	var socket = null;
    var connecting = false
        ,connected = false;
    var waiting = [];

    var with_socket = function(callback) {
        if (connected) {
            return callback(socket);
        };
        waiting.push(callback);

        if (connecting) {
            // wait for on 'connect'
            return;
        }
        socket = net.connect(port, host);
        socket.setTimeout(socket_timeout);
        socket.setKeepAlive(true);

        socket.on('connect', function() {
            waiting.forEach(function (cb) {
                cb(socket);
            });
            return;
        });

        var on_error = function() {
            socket.destroy();
            connected = false;
        }

        socket.on('error', on_error);
        socket.on('timeout', on_error);
    }

    var write = function(line, callback) {
        with_socket(function (socket) {
            return socket.write(line, callback);
        });
    }

    return {
        write: write
    }
};
