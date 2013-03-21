'use strict';

module.exports = function(grunt) {
  pkg: grunt.file.readJSON('package.json'),
  grunt.initConfig({
    nodeunit: {
      files: ['test/**/*_test.js'],
    },
    jshint: {
      files: ['gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        jshintrc: '.jshintrc',
        node: true,
        strict: false,
        globals: {
            console: true,
            module: true,
            document: true
        }
      }
    },
    watch: {
      files: ['gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      tasks: ['jshint', 'nodeunit']
    },
  });

  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint', 'nodeunit']);
};
