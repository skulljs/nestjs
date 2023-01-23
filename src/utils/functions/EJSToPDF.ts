import * as puppeteer from 'puppeteer';
import * as ejs from 'ejs';
import * as path from 'path';

interface options {
  template: string;
  context: object;
  orientation?: string;
  pageFormat?: string;
  margin?: { top: string; right: string; bottom: string; left: string };
}

let page;
const getPage = async () => {
  if (page) return page;
  const browser = await puppeteer.launch({
    headless: true,
    args: [],
  });
  page = await browser.newPage();
  return page;
};

export default async function (options: options): Promise<Buffer> {
  const templateFile = path.join(__dirname, `/../../../templates/pdfs/${options.template}.ejs`);

  // setup puppeteer page configs
  const pdfConfigs: any = { printBackground: true, preferCSSPageSize: true };

  if (options.orientation == 'p' || !options.orientation) {
    pdfConfigs.landscape = false;
  } else {
    pdfConfigs.landscape = true;
  }

  pdfConfigs.format = options.pageFormat ? options.pageFormat : 'A4';

  pdfConfigs.margin = options.margin
    ? options.margin
    : {
        top: '15mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm',
      };

  // render EJS
  const html = await ejs.renderFile(templateFile, options.context);

  // start puppeteer
  const page = await getPage();

  // set html content
  await page.setContent(html, {
    waitUntil: 'domcontentloaded',
  });

  // make sure fonts have loaded before screenshot and pdf generation
  await page.evaluateHandle('document.fonts.ready');

  // reflect CSS used for screens instead of print
  await page.emulateMediaType('screen');

  // generate PDF with configs
  const buffer = await page.pdf(pdfConfigs);

  return buffer;
}
