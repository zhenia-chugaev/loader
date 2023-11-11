import fs from 'fs/promises';
import path from 'path';
import { load } from 'cheerio';
import client from './httpClient.js';
import loadAsset from './loadAsset.js';
import isLocalAsset from './isLocalAsset.js';
import getName from './getName.js';

const map = {
  IMG: 'src',
  LINK: 'href',
  SCRIPT: 'src',
};

const loadPage = (pageUrl, outDir = '.') => {
  const resolvedPath = path.resolve(process.cwd(), outDir);

  const filename = getName(pageUrl, '.html');
  const dirname = getName(pageUrl, '_files');

  const filepath = path.join(resolvedPath, filename);
  const assetsPath = path.join(resolvedPath, dirname);

  let assetsUrls;

  const result = client.get(pageUrl)
    .then(({ data }) => {
      const $ = load(data, { baseURI: pageUrl });

      const getSource = (element) => {
        const $element = $(element);
        const tagName = $element.prop('tagName');
        return $element.prop(map[tagName]);
      };

      const setSource = (element, url) => {
        const $element = $(element);
        const tagName = $element.prop('tagName');
        return $element.attr(map[tagName], url);
      };

      const $assets = $('img[src], link[href], script[src]')
        .filter((_, asset) => {
          const assetUrl = getSource(asset);
          const { origin } = new URL(pageUrl);
          return isLocalAsset(assetUrl, origin);
        });

      assetsUrls = $assets
        .map((_, asset) => getSource(asset))
        .toArray();

      $assets.each((_, asset) => {
        const url = getSource(asset);
        const { pathname } = new URL(url);
        const extension = path.extname(pathname) || '.html';
        const assetName = getName(url, extension);
        const assetPath = path.posix.join(dirname, assetName);
        setSource(asset, assetPath);
      });

      return fs.writeFile(filepath, $.html());
    })
    .then(() => fs.mkdir(assetsPath))
    .then(() => Promise.all(
      assetsUrls.map((url) => loadAsset(url, assetsPath)),
    ))
    .then(() => ({ filepath }));

  return result;
};

export default loadPage;
