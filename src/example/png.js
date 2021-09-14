const { createScreenshotsApiModel } = require("../index");

const env = {
  jwtSecret : 'test',
}

const apiModel = createScreenshotsApiModel({
  type : 'png',
  contentDisposition : 'inline',
  renderer : ({title}) => {
    return `
    <html>
      <body>
        <h1>${title}</h1>
        <p>Test test</p>
      </body>
    </html>
    `;
  },
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
