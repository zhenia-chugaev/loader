import os from 'os';
import fs from 'fs/promises';
import path from 'path';
import nock from 'nock';
import { format } from 'prettier';
import readFixture from '../utils/readFixture.js';
import loadPage from '../src/main.js';

nock.disableNetConnect();

const url = 'https://ru.hexlet.io';
const pathname = '/node';
const cssPathname = '/assets/style.css';
const imagePathname = '/assets/images/nodejs.png';
const jsPathname = '/packs/js/script.js';

const pageUrl = new URL(pathname, url).toString();

let initialHtml;
let finalHtml;
let imageBuffer;
let cssBuffer;
let jsBuffer;

let tmpDir;

beforeAll(async () => {
  [
    initialHtml,
    finalHtml,
    imageBuffer,
    cssBuffer,
    jsBuffer,
  ] = await Promise.all([
    readFixture('initial.html', 'utf-8'),
    readFixture('final.html', 'utf-8'),
    readFixture('node.png'),
    readFixture('style.css'),
    readFixture('script.js'),
  ]);
});

beforeEach(() => {
  nock(url)
    .get(pathname).times(2)
    .reply(200, initialHtml)
    .get(cssPathname)
    .reply(200, cssBuffer)
    .get(imagePathname)
    .reply(200, imageBuffer)
    .get(jsPathname)
    .reply(200, jsBuffer);
});

beforeEach(async () => {
  const prefix = path.join(os.tmpdir(), 'page-loader-');
  tmpDir = await fs.mkdtemp(prefix);
});

it('saves the page', async () => {
  const result = await loadPage(pageUrl, tmpDir);
  const filepath = path.join(tmpDir, 'ru-hexlet-io-node.html');

  expect(result).toEqual({ filepath });

  const rawHtml = await fs.readFile(result.filepath, 'utf-8');
  const html = await format(rawHtml, {
    parser: 'html',
    printWidth: 105,
  });

  expect(html).toBe(finalHtml);

  const assetsDir = path.join(tmpDir, 'ru-hexlet-io-node_files');
  const promises = await fs.readdir(assetsDir)
    .map((assetPath) => fs.readFile(assetPath));

  const assets = await Promise.all(promises);

  expect(assets).toHaveLength(4);
  expect(assets).toContainEqual(Buffer.from(initialHtml));
  expect(assets).toContainEqual(imageBuffer);
  expect(assets).toContainEqual(cssBuffer);
  expect(assets).toContainEqual(jsBuffer);
});
