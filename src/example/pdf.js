const { createScreenshotsApiModel } = require("../index");

const env = {
  jwtSecret : 'test',
}

const apiModel = createScreenshotsApiModel({
  type : 'pdf',
  contentDisposition : 'inline',
  // contentDispositionFileName : 'test.pdf',
  loader : () => 'https://www.wikipedia.org/',
  puppeteerOptions : {
    format : 'A4'
  }
})

const server  = apiModel.toServer(env);

(async () => {
  try {
    await server.listen(8100);
    console.info(`Server is listening to port ${8100}`);
  }
  catch(error) {
    console.error(error);
  }
})()
