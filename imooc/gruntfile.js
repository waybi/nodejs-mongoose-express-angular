module.exports = function(grunt) {

	grunt.initConfig({
		watch: {
			jade: {
				files: ['views/**'],
				options: {
					livereload: true
				}
			},
			js: {
				files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
//				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			uglify: {
				files: ['public/**/*.js'],
				// tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			styles: {
				files: ['public/**/*.less'],
				tasks: ['less'],
				options: {
					nospawn: true
				}
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc',
				ignores: ['public/libs/**/*.js']
			},
			all: ['public/js/*.js', 'test/**/*.js', 'app/**/*.js']
		},

		less: {
			development: {
				options: {
					compress: true,
					optimization: 2
				},
				files: {
					'public/build/index.css': 'public/less/index.less'
				}
			}
		},

		uglify: {
			development: {
				files: {
					'public/build/admin.min.js': 'public/js/admin.js',
					'public/build/detail.min.js': [ // 支持多个文件压缩成一个
						'public/js/detail.js'
					]
				}
			}
		},

		nodemon: {
			dev: {
				options: {
					file: 'app.js',
					args: [],
					ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
					watchedExtensions: ['js'],
					watchedFolders: ['./'],
					debug: true,
					delayTime: 1,
					env: {
						PORT: 3000
					},
					cwd: __dirname
				}
			}
		},

		mochaTest: {
			options: {
				reporter: 'spec'
			},
			src: ['test/**/*.js']
		},

		concurrent: {
			tasks: ['nodemon', 'watch','less','uglify'],
			options: {
				logConcurrentOutput: true
			}
		}
	});

	/*
	*********  加载模块 *********
	* */
	grunt.loadNpmTasks('grunt-contrib-watch'); //实时监听文件刷新服务
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-mocha-test'); // 测试
	grunt.loadNpmTasks('grunt-contrib-less'); // 编译less文件
	grunt.loadNpmTasks('grunt-contrib-uglify'); // 压缩文件
	grunt.loadNpmTasks('grunt-contrib-jshint'); // js语法检测

	grunt.option('force', true); // 开发时发生错误不中断服务

  	grunt.registerTask('default', ['concurrent']);
  	grunt.registerTask('test', ['mochaTest']);
}