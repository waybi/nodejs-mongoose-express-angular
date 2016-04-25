/**
 * Created by waybe on 16/4/18.
 */

module.exports = function (grunt) {
    grunt.initConfig({
        watch:{
            js:{
                files: ['static/js/**', 'models/**/*.js', './*.js'],
                options: {
                    livereload: true
                }
            }
        },

        nodemon: {
            dev: {
                options: {
                    file: 'index.js',
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
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-watch'); //实时监听文件刷新服务
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');


    grunt.registerTask('default',['concurrent']);
}