module.exports = {
  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : 'root',
      host : '95.213.204.224 ',
      ref  : 'origin/master',
      repo : 'git@github.com:VictorKolb/victorkolb.ru.git',
      path : '/var/www/victorkolb',
      'post-deploy' : ''
    },
  }
};
