import os from 'os';
import fs from 'fs/promises';
import path from 'path';
import nock from 'nock';
import { format } from 'prettier';
import readFixture from '../utils/readFixture.js';
import loadPage from '../src/main.js';

nock.disableNetConnect();

let initialHtml;
let finalHtml;
let imageBuffer;

let tmpDir;

beforeAll(async () => {
  [initialHtml, finalHtml, imageBuffer] = await Promise.all([
    readFixture('initial.html', 'utf-8'),
    readFixture('final.html', 'utf-8'),
    readFixture('node.png'),
  ]);
});

beforeEach(async () => {
  const prefix = path.join(os.tmpdir(), 'page-loader-');
  tmpDir = await fs.mkdtemp(prefix);
});

it('returns object with filepath', async () => {
  const url = 'https://page-loader.hexlet.repl.co';
  const assetPathname = '/assets/images/nodejs.png';
  nock(url)
    .get('/')
    .reply(200, initialHtml)
    .get(assetPathname)
    .reply(200, imageBuffer);
  const result = await loadPage(url, tmpDir);
  const filepath = path.join(tmpDir, 'page-loader-hexlet-repl-co.html');

  expect(result).toEqual({ filepath });
});

it('saves the page', async () => {
  const url = 'https://ru.hexlet.io';
  const pathname = '/node';
  const assetPathname = '/assets/images/nodejs.png';
  nock(url)
    .get(pathname)
    .reply(200, initialHtml)
    .get(assetPathname)
    .reply(200, imageBuffer);
  const pageUrl = new URL(pathname, url).toString();
  const { filepath } = await loadPage(pageUrl, tmpDir);
  const rawHtml = await fs.readFile(filepath, 'utf-8');
  const html = await format(rawHtml, { parser: 'html' });

  expect(html).toBe(finalHtml);

  const imagePath = path.join(
    tmpDir,
    'ru-hexlet-io-node_files',
    'ru-hexlet-io-assets-images-nodejs.png',
  );
  const buffer = await fs.readFile(imagePath);

  expect(buffer).toEqual(imageBuffer);
});
