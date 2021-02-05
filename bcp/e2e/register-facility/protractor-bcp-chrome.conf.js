// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts
// https://moh-bcp-dev.pathfinder.gov.bc.ca

const { SpecReporter } = require('jasmine-spec-reporter');

// browser = await puppeteer.launch({
//   executablePath: process.env.PUPPETEER_EXEC_PATH, // set by docker container
//   headless: false,
// });

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './src/*.e2e-spec.ts'
  ],
  multiCapabilities: [
    {
      browserName: 'chrome',
      chromeOptions: {
        args: ['--headless']
      }
    }
  ],
  directConnect: true,
  baseUrl: 'http://localhost:4300/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.e2e.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
};