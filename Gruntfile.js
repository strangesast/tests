module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jade: {
      options: {
        //pretty: true
      },
      template: {
        options: {
          client: true,
          namespace: 'Templates'
        },
        expand: true,
        cwd: 'templates',
        src: ['**/*.jade'],
        dest: 'public/templates',
        ext: '.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.registerTask('default', ['jade']);
  return;
};
