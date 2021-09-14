const puppeteer = require('puppeteer');

/*
  Creates a screenshot with Puppeteer
*/
const createScreenshotHandler = (options) => async (data, flow, meta) => {
  console.info('screenshotsHandler()');

  const {
    renderer,
    loader,
    contentDisposition = 'attachment',
    contentDispositionFileName,
    type = 'png',
    puppeteerOptions = {format : 'A4'},
  } = options;

  const { request, response } = meta;

  const { type : _trash1, path : _trash2, ...sanitizedOptions } = puppeteerOptions;


  if(!renderer && !loader) {
    console.error('screenshotsHandler(): You should provide either a renderer or loader function')
    return flow.stop(500);
  }

  if(!['pdf', 'png', 'jpeg'].includes(type)) {
    console.error(`screenshotsHandler(): Unknown type '${type}'`)
    return flow.stop(500);
  }


  // Puppeteer initialization
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Load content into page
  if(renderer) {
    const html = await renderer(request.query);
    await page.setContent(html);
  }
  else if (loader) {
    const url = await loader(request.query);
    await page.goto(url);
  }

  let buffer;
  if(type === 'pdf') {
    buffer = await page.pdf({...sanitizedOptions});
  }
  else {
    buffer = await page.screenshot({...sanitizedOptions});
  }

  await browser.close();

  const _cdFileName = contentDisposition === 'attachment' && contentDispositionFileName ?
    (
      `; filename="${
        typeof contentDispositionFileName === 'function' ?
          contentDispositionFileName(request.query) :
          contentDispositionFileName
      }"`
    ) :
    '';

  response.headers['Content-Disposition'] = contentDisposition + _cdFileName
  response.headers['Content-Type'] = 
      type === 'pdf' ? 'application/pdf' :
      type === 'png' ? 'image/png' : 
      'image/jpeg'
  return flow.continue(buffer);
};


module.exports = {
  createScreenshotHandler,
}
