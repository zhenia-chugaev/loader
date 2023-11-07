import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import { load } from 'cheerio';
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

  let filepath;
  let assetsPath;
  let assetsUrls;

  const result = axios.get(pageUrl)
    .then(({ data }) => {
      const $ = load(data, { baseURI: pageUrl });

      const filename = getName(pageUrl, '.html');
      filepath = path.join(resolvedPath, filename);

      const dirname = getName(pageUrl, '_files');
      assetsPath = path.join(resolvedPath, dirname);

      const extractUrl = (el) => {
        const $el = $(el);
        const tagName = $el.prop('tagName');
        return $el.prop(map[tagName]);
      };

      const insertUrl = (el, url) => {
        const $el = $(el);
        const tagName = $el.prop('tagName');
        return $el.attr(map[tagName], url);
      };

      const $assets = $('img[src], link[href], script[src]')
        .filter((_, asset) => {
          const assetUrl = extractUrl(asset);
          const { origin } = new URL(pageUrl);
          return isLocalAsset(assetUrl, origin);
        });

      assetsUrls = $assets
        .map((_, asset) => extractUrl(asset))
        .toArray();

      $assets.each((_, asset) => {
        const url = extractUrl(asset);
        const { pathname } = new URL(url);
        const extension = path.extname(pathname) || '.html';
        const assetName = getName(url, extension);
        const assetPath = path.posix.join(dirname, assetName);
        insertUrl(asset, assetPath);
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
