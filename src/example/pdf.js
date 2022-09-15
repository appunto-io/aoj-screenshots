const { createScreenshotsApiModel } = require("../index");

const env = {
  jwtSecret : 'test',
}

const apiModel = createScreenshotsApiModel({
  type : 'pdf',
  contentDisposition : 'inline',
  // contentDispositionFileName : 'test.pdf',
  loader : () => 'https://www.wikipedia.org/',
  headerTemplate : (query) => `
    <div style="font-family: 'Montserrat', sans-serif; margin-right : 40px; margin-left:40px; color : #252F3A;; border-bottom: solid black 0.2px; font-size: 10px; padding-top: 5px; display: flex; align-items : center; justify-content: space-between; width: 100%;">
      <span class="toto">${query.title}</span>
      <div style="width:30px; height:30px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 96.629 183.746">
          <g id="Emblème_Noir" data-name="Emblème Noir" transform="translate(-106.296 -192.884)">
            <circle id="Ellipse_1" data-name="Ellipse 1" cx="13.77" cy="13.77" r="13.77" transform="translate(140.45 306.59)" fill="#f75252"/>
            <path id="Tracé_1" data-name="Tracé 1" d="M154.26,192.89a47.925,47.925,0,1,1,1.47,95.839v-.009a47.933,47.933,0,1,1-3-95.82C153.22,192.89,153.74,192.89,154.26,192.89Zm-.07,70.71h.75a22.78,22.78,0,0,0,14.87-39.38A23.06,23.06,0,0,0,153.5,218a22.79,22.79,0,0,0,.69,45.56Zm1.14,12.56Z"/>
            <circle id="Ellipse_2" data-name="Ellipse 2" cx="13.77" cy="13.77" r="13.77" transform="translate(140.45 349.09)" fill="#535cf4"/>
          </g>
        </svg>
      </div>
    </div>`,
  footerTemplate : '   -----   ',
  puppeteerOptions : (query) => ({
    displayHeaderFooter : true,
    format : 'A4',
    margin: {
      bottom: "100px",
      left: "50px",
      right: "50px",
      top: query.topmargin,
    },
  })
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
