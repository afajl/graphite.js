'use strict';

var graphite = require('../lib/graphite.js');
var net = require('net');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.socket = {

  setUp: function(done) {
    this.received = [];
    this.server = net.createServer(function (c) {
        c.on('data', function (data) {
            console.log('recieved ' + data);
            this.received.push(data);
        });
    }).listen(9876, done);
  },

  tearDown: function(done) {
    this.server.close(done);
  },

  'send one line': function(test) {
    var conn = graphite.connect(9876);   
    var that = this;
    conn.write('one line', function () {
        test.equal(that.received.length, 1);
        test.done();
    });
    console.log('in teardown', this.received);
  }
};
