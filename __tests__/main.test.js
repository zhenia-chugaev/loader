import os from 'os';
import fs from 'fs/promises';
import path from 'path';
import nock from 'nock';
import readFixture from '../utils/readFixture.js';
import loadPage from '../src/main.js';

const pageUrl = 'https://page-loader.hexlet.repl.co';

nock.disableNetConnect();

let html;
let tmpDir;

beforeAll(async () => {
  html = await readFixture('index.html', 'utf-8');
});

beforeEach(async () => {
  const prefix = path.join(os.tmpdir(), 'page-loader-');
  tmpDir = await fs.mkdtemp(prefix);
});

it('saves the page', async () => {
  const scope = nock(pageUrl);

  scope.get('/').reply(200, html);

  const { filepath } = await loadPage(pageUrl, tmpDir);
  const data = await fs.readFile(filepath, 'utf-8');

  expect(data).toBe(html);
});

it('forms the filepath correctly', async () => {
  const scope = nock(pageUrl);
  const pathname = '/courses';

  scope.get(pathname).reply(200, html);

  const result = await loadPage(new URL(pathname, pageUrl).toString(), tmpDir);
  const filepath = path.join(tmpDir, 'page-loader-hexlet-repl-co-courses.html');

  expect(result).toEqual({ filepath });
});
