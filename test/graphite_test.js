'use strict';

var graphite = require('../lib/graphite.js');
var net = require('net');
var EventEmitter = require('events').EventEmitter;
//var util = require('util');
/*
var TestServer = function (func) {
    this.host = '127.0.0.1';
    this.port = 9876;
};

TestServer.prototype.start = function () {
    var that = this;
    this.server = net.createServer(func (socket) {
        that.conn_count++;
        return this.func(socket);
    }).listen(this.port, this.host); 
};
*/




exports.socket = {
  setUp: function(done) {
    var received = this.received = [];
    var events = this.events = new EventEmitter();
    this.server = net.createServer(function (c) {
        console.log('server started');
        c.on('data', function (data) {
            received.push(data);
            console.log("%s", data);
            events.emit('data');
        });
        c.on('end', function () {
            events.emit('end');
        });
    }).listen(9876, '127.0.0.1', done);
  },

  tearDown: function(done) {
    this.server.close(done);
  },

  'send one line': function(test) {
    var that = this;
    var conn = graphite.connect(9876, '127.0.0.1');   
    conn.write('one line', function () {
        conn.close();
    });
    this.events.on('data', function () {
        test.equal(that.received.length, 1);
        test.done();
    });
  },
  'send two lines': function(test) {
    var that = this;
    var conn = graphite.connect(9876, '127.0.0.1');   
    conn.write('line 1');
    conn.write('line 2', function () { 
        conn.close();
    });
    this.events.on('end', function () {
        test.equal(that.received.length, 2);
        test.done();
    });
  } 
};
