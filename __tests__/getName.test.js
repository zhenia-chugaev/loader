import { getName, getAssetName } from '../src/getName.js';

test.each([
  ['https://example.org', 'example-org'],
  ['https://ru.hexlet.io/my', 'ru-hexlet-io-my'],
  ['http://www.example.org:443/path/to?foo=bar#hash', 'www-example-org-path-to-foo-bar'],
])('name construction', (url, expected) => {
  expect(getName(url)).toBe(expected);
});

test.each([
  ['https://example.org', '.html', 'example-org.html'],
  ['https://ru.hexlet.io/my', '_files', 'ru-hexlet-io-my_files'],
  ['https://page-loader.hexlet.repl.co', '-uk', 'page-loader-hexlet-repl-co-uk'],
  ['http://domain.ru/', '', 'domain-ru'],
])('name construction with suffix', (url, suffix, expected) => {
  expect(getName(url, suffix)).toBe(expected);
});

test.each([
  ['https://example.com/index.html', 'example-com-index.html'],
  ['https://ru.hexlet.io/assets/local/icon.svg', 'ru-hexlet-io-assets-local-icon.svg'],
  ['http://domain.ru/docs/user-names.json', 'domain-ru-docs-user-names.json'],
])('assets name construction', (url, expected) => {
  expect(getAssetName(url)).toBe(expected);
});
