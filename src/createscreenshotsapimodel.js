const { ApiModel } = require('@appunto/api-on-json');

const { createScreenshotHandler } = require('./model/library');

function createScreenshotsApiModel(options = {}) {
  const {
    apiName = 'screenshots',
    auth = {requiresAuth : false},
    httpMethod = 'GET',
  } = options;

  const apiModel = new ApiModel({
    [`/${apiName}`] : {
      auth,
      handlers : {
        [httpMethod] : [
          createScreenshotHandler(options)
        ]
      },
    }
  });

  return apiModel;
}

module.exports = {createScreenshotsApiModel}
