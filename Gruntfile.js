module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concat: {
		    dist: {
		        src: [
		            '_js/*.js' // All JS in the libs folder
		        ],
		        dest: '_js/production.js'
		    }
		},
		jshint: {
			options: {
				reporter: require('jshint-stylish')
			},
			all: ['Grunfile.js', '_js/*.js', '!_js/libs/**/*.js', '!_js/main.min.js']
		},
		uglify: {
			options: {
				banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
			},
			build: {
				files: {
					'_js/main.min.js': '_js/main.js'
				}
			}
		},
		less: {
			build: {
				files: {
					'_css/main.css': '_css/main.less'
				}
			},
			options: {
				'compress': true,
				'ieCompat': true,
			}
		},		
		watch: {
			stylesheets: {
				files: ['_css/*.less'],
				tasks: ['less']
			},
			scripts: {
				files: '_js/**/*.js',
				tasks: ['jshint', 'uglify']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['jshint', 'uglify', 'less', 'watch']);
};