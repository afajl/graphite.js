var net = require('net');
var socket_timeout = 5000;

exports.connect = function(port, host) {
	var socket = null;
    var connecting = false
        ,connected = false;
    var waiting = [];

    var close = function () {
        socket.destroy();
        connected = false;
        connecting = false;
    };

    var with_socket = function(callback) {
        if (connected) {
            return callback(socket);
        };
        waiting.push(callback);

        if (connecting) {
            // wait for on 'connect'
            return;
        }
        connecting = true;

        socket = net.connect(port, host);
        socket.setTimeout(socket_timeout);
        socket.setKeepAlive(true);

        socket.on('connect', function() {
            connected = true;
            connecting = false;
            waiting.forEach(function (callback) {
                callback(socket);
            });
        });

        socket.on('error', close);
        socket.on('timeout', close);
    }

    var write = function(line, callback) {
        with_socket(function (socket) {
            socket.write(line, callback);
        });
    }

    return {
        write: write,
        close: close
    }
};
