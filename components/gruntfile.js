module.exports = function(grunt) {

    grunt.initConfig({
        watch: {
            js: {
                files: ['static/js/**', 'models/**/*.js', './*.js'],
                options: {
                    livereload: true
                }
            },
        },

        cssmin: {
            options: {
                keepSpecialComments: 0
            },
            compress: {
                files: {
                    'static/assets/css/default.css': [
                        "static/css/draggable_styles.css",
                        "static/css/rich_ui_styles.css",
                        "static/css/table_styles.css",
                        "static/css/weather_styles.css"
                    ]
                }
            }
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
            tasks: ['nodemon', 'watch','cssmin'],
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
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // grunt.option('force', true); // 开发时发生错误不中断服务

    grunt.registerTask('default', ['concurrent']);
}