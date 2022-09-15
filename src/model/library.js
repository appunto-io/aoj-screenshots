const puppeteer = require('puppeteer');

/*
  Creates a screenshot with Puppeteer
*/
const createScreenshotHandler = (options) => async (data, flow, meta) => {
  console.info('screenshotsHandler()');

  const {
    dataLoader = () => {},
    renderer,
    loader,
    contentDisposition = 'attachment',
    contentDispositionFileName,
    type = 'png',
    puppeteerOptions = {format : 'A4'},
    headerTemplate,
    footerTemplate
  } = options;

  const { request, response } = meta;

  data = await dataLoader(request.query, request.params);

  const computedOptions = typeof puppeteerOptions === 'function' ? await puppeteerOptions(request.query, data) : puppeteerOptions;

  const { type : _trash1, path : _trash2, ...sanitizedOptions } = computedOptions;


  if(!renderer && !loader) {
    console.error('screenshotsHandler(): You should provide either a renderer or loader function')
    return flow.stop(500);
  }

  if(!['pdf', 'png', 'jpeg'].includes(type)) {
    console.error(`screenshotsHandler(): Unknown type '${type}'`)
    return flow.stop(500);
  }


  // Puppeteer initialization
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();

  // Load content into page
  if(renderer) {
    const html = await renderer(request.query, data);
    await page.setContent(html);
  }
  else if (loader) {
    const url = await loader(request.query, data);
    await page.goto(url);
  }

  let buffer;
  if(type === 'pdf') {
    const headerHTML = typeof headerTemplate === 'function' ?
      await headerTemplate(request.query, data) :
      headerTemplate ? headerTemplate :
      '';

    const footerHTML = typeof footerTemplate === 'function' ?
      await footerTemplate(request.query, data) :
      footerTemplate ? footerTemplate :
      '';


    buffer = await page.pdf({...sanitizedOptions, headerTemplate : headerHTML, footerTemplate : footerHTML});
  }
  else {
    buffer = await page.screenshot({fullPage: true, ...sanitizedOptions});
  }

  await browser.close();

  const _cdFileName = contentDispositionFileName ?
    (
      `; filename="${
        typeof contentDispositionFileName === 'function' ?
          contentDispositionFileName(request.query, data) :
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
