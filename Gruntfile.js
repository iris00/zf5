'use strict';
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        app: 'app',
        dist: 'dist',
        sass: {
            options: {
                includePaths: ['<%= app %>/bower_components/foundation/scss']
            },
            dist: {
                options: {
                    outputStyle: 'extended',
                    sourceMap: true
                },
                files: {
                    '<%= app %>/css/app.css': '<%= app %>/scss/app.scss'
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: ['Gruntfile.js', '<%= app %>/js/**/*.js']
        },
        clean: {
            dist: {
                src: ['<%= dist %>/*']
            },
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= app %>/',
                    src: ['fonts/**', '**/*.html', '!**/*.scss', '!bower_components/**', '!iconos-sprite.html/**'],
                    dest: '<%= dist %>/'
                }, {
                    expand: true,
                    flatten: true,
                    src: ['<%= app %>/bower_components/font-awesome/fonts/**'],
                    dest: '<%= dist %>/fonts/',
                    filter: 'isFile'
                }]
            },
            svg: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['<%= app %>/scss/img/icons/icons-sprite.svg', '<%= app %>/scss/img/icons/**/*.png'],
                    dest: '<%= app %>/img/icons',
                    filter: 'isFile'
                }]
            }
        },
        svgmin: { // Task
            options: { // Configuration that will be passed directly to SVGO
                plugins: [{
                    removeViewBox: false
                }, {
                    removeUselessStrokeAndFill: false
                }, {
                    convertPathData: {
                        straightCurves: false // advanced SVGO plugin option
                    }
                }]
            },
            dist: { // Target
                files: [{ // Dictionary of files
                    expand: true, // Enable dynamic expansion.
                    cwd: '<%= app %>/src/images/icons', // Src matches are relative to this path.
                    src: ['**/*.svg'], // Actual pattern(s) to match.
                    dest: '<%= app %>/scss/img/icons', // Destination path prefix.
                    ext: '.svg' // Dest filepaths will have this extension.
                }]
            }
        },
        'svg-sprites': {
            iconos: {
                options: {
                    spriteElementPath: '<%= app %>/scss/img/icons/', //The base path of the elements to be sprited.
                    spritePath: '<%= app %>/scss/img/icons/icons-sprite.svg', // Destination path of the generated sprite images.
                    previewPath: '<%= app %>/', // The path where to built a preview page. 
                    cssPath: '<%= app %>/scss/_icons.scss', // Destination path of the generated stylesheet.
                    // cssSuffix: 'scss', Stylesheet filetype suffix. Only used when automatically building stylesheet filenames.
                    // cssPrefix: '_', Defines a prefix for the name of the sprite stylesheet (this overrides options.prefix if set). Only used when automatically building stylesheet filenames.
                    prefix: 'ico', // Defines a prefix for the name of the sprite stylesheet, images and classnames.
                    sizes: {
                        large: 24,
                        small: 16
                    },
                    refSize: 'large',
                    //unit: 5
                }
            }
        },
        imagemin: {
            target: {
                files: [{
                    expand: true,
                    cwd: '<%= app %>/images/',
                    src: ['**/*.{jpg,gif,svg,jpeg,png}'],
                    dest: '<%= dist %>/images/'
                }]
            }
        },
        uglify: {
            options: {
                preserveComments: 'some',
                mangle: false
            }
        },
        useminPrepare: {
            html: ['<%= app %>/index.html'],
            options: {
                dest: '<%= dist %>'
            }
        },
        usemin: {
            html: ['<%= dist %>/**/*.html', '!<%= app %>/bower_components/**'],
            css: ['<%= dist %>/css/**/*.css'],
            options: {
                dirs: ['<%= dist %>']
            }
        },
        watch: {
            grunt: {
                files: ['Gruntfile.js'],
                tasks: ['sass']
            },
            sass: {
                files: '<%= app %>/scss/**/*.scss',
                tasks: ['sass']
            },
            livereload: {
                files: ['<%= app %>/**/*.html', '!<%= app %>/bower_components/**', '<%= app %>/js/**/*.js', '<%= app %>/css/**/*.css', '<%= app %>/images/**/*.{jpg,gif,svg,jpeg,png}'],
                options: {
                    livereload: true
                }
            }
        },
        connect: {
            app: {
                options: {
                    port: 9000,
                    base: '<%= app %>/',
                    open: true,
                    livereload: true,
                    hostname: '127.0.0.1'
                }
            },
            dist: {
                options: {
                    port: 9001,
                    base: '<%= dist %>/',
                    open: true,
                    keepalive: true,
                    livereload: false,
                    hostname: '127.0.0.1'
                }
            }
        },
        bowerInstall: {
            target: {
                src: ['<%= app %>/**/*.html'],
                exclude: ['modernizr', 'font-awesome', 'jquery-placeholder', 'jquery.cookie', 'foundation']
            }
        }
    });
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-svgmin');
    grunt.loadNpmTasks('grunt-dr-svg-sprites');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-bower-install');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-newer');
    grunt.registerTask('compile-sass', ['sass']);
    grunt.registerTask('bower-install', ['bowerInstall']);
    grunt.registerTask('svg', ['svgmin', 'svg-sprites', 'copy:svg']);
    grunt.registerTask('default', ['compile-sass', 'bower-install', 'connect:app', 'watch']);
    grunt.registerTask('validate-js', ['jshint']);
    grunt.registerTask('server-dist', ['connect:dist']);
    grunt.registerTask('publish', ['compile-sass', 'clean:dist', /*'validate-js',*/ 'useminPrepare', 'copy:dist', 'newer:imagemin', 'concat', 'cssmin', 'uglify', 'usemin']);
};