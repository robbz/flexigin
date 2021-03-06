'use strict';

module.exports = function (grunt) {

  var banner = '/*!\n' +
                ' * <%= pkg.name %> - v<%= pkg.version %>\n' +
                ' * (c) <%= pkg.author %>\n' +
                ' * License: MIT (http://www.opensource.org/licenses/mit-license.php)\n' +
                ' * <%= grunt.template.today("yyyy-mm-dd") %> \n' +
                ' */\n';

  var jsFiles = ['lib/flexigin.js', 'lib/load.js', 'lib/resolve.js']

  grunt.initConfig({
    jshint: {
      files: [ '**/*.js', '!node_modules/**/*.js', '!public/**/*.js' ],
      options: {
        jshintrc: 'jshint.json'
      }
    },

    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: banner
      },
      my_target: {
        files: {
          'bin/flexigin-<%= pkg.version %>.min.js': jsFiles
        }
      }
    },

    concat: {
      options: {
        banner: banner
      },
      dist: {
        src: jsFiles,
        dest: 'bin/flexigin-<%= pkg.version %>.js'
      }
    },

    watch: {
      options: {
        files: [ 'lib/*.js', '!node_modules/**/*.js' ],
        tasks: [ 'default' ],
        interrupt: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', [ 'uglify', 'concat' ]);
};