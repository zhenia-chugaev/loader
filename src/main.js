import fs from 'fs/promises';
import path from 'path';
import { load } from 'cheerio';
import client from './httpClient.js';
import log from './logger.js';
import loadAsset from './loadAsset.js';
import isLocalAsset from './isLocalAsset.js';
import getName from './getName.js';

const map = {
  IMG: 'src',
  LINK: 'href',
  SCRIPT: 'src',
};

const getSource = ($element) => {
  const tagName = $element.prop('tagName');
  return $element.prop(map[tagName]);
};

const setSource = ($element, url) => {
  const tagName = $element.prop('tagName');
  return $element.attr(map[tagName], url);
};

const getAssetPath = (url, dirname) => {
  const { pathname } = new URL(url);
  const extension = path.extname(pathname) || '.html';
  const assetName = getName(url, extension);
  const assetPath = path.posix.join(dirname, assetName);
  return assetPath;
};

const loadPage = (pageUrl, outDir = '.') => {
  const resolvedPath = path.resolve(process.cwd(), outDir);

  const filename = getName(pageUrl, '.html');
  const dirname = getName(pageUrl, '_files');

  const filepath = path.join(resolvedPath, filename);
  const assetsPath = path.join(resolvedPath, dirname);

  let assetsUrls;

  log('loading resource from %s', pageUrl);

  const result = client.get(pageUrl)
    .then(({ data, status }) => {
      log('succeeded (%d, %s)', status, pageUrl);

      const $ = load(data, { baseURI: pageUrl });

      const $assets = $('img[src], link[href], script[src]')
        .filter((_, asset) => {
          const assetUrl = getSource($(asset));
          const { origin } = new URL(pageUrl);
          return isLocalAsset(assetUrl, origin);
        });

      assetsUrls = $assets
        .map((_, asset) => getSource($(asset)))
        .toArray();

      $assets.each((_, asset) => {
        const $asset = $(asset);
        const url = getSource($asset);
        const assetPath = getAssetPath(url, dirname);
        setSource($asset, assetPath);
      });

      log('saving processed html as %s', filename);

      return fs.writeFile(filepath, $.html());
    })
    .then(() => {
      log('creating assets folder (%s)', dirname);
      return fs.mkdir(assetsPath);
    })
    .then(() => Promise.all(
      assetsUrls.map((url) => loadAsset(url, assetsPath)),
    ))
    .then(() => ({ filepath }));

  return result;
};

export default (pageUrl, outDir) => new Promise((resolve) => {
  resolve(loadPage(pageUrl, outDir));
});
