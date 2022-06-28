const helpers = require("./helpers");

exports.config = {
  framework: "jasmine",
  seleniumAddress: "http://localhost:4444/wd/hub",
  specs: [helpers.root("src/**/**.e2e.ts"), helpers.root("src/**/*.e2e.ts")],
  directConnect: true,
  capabilities: {
    browserName: "chrome",
    chromeOptions: {
      args: [
        "--headless",
        "--disable-gpu",
        "--window-size=800x600",
        "--no-sandbox",
      ],
    },
  },
};
