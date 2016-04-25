module.exports = function(grunt) {

    grunt.initConfig({
        watch: {
            js: {
                files: ['static/js/**', 'models/**/*.js', './*.js'],
				tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                ignores: ['static/libs/**/*.js']
            },
            all: ['static/js/*.js', './*.js']
        },

        nodemon: {
            dev: {
                options: {
                    file: 'server.js',
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

        concurrent: {
            tasks: ['nodemon', 'watch','jshint'],
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
    grunt.loadNpmTasks('grunt-contrib-jshint'); // js语法检测

    // grunt.option('force', true); // 开发时发生错误不中断服务

    grunt.registerTask('default', ['concurrent']);
}