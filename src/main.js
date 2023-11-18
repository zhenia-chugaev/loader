import fs from 'fs/promises';
import path from 'path';
import { load } from 'cheerio';
import Listr from 'listr';
import client from './httpClient.js';
import log from './logger.js';
import LoaderError from './LoaderError.js';
import loadAsset from './loadAsset.js';
import isLocalAsset from './isLocalAsset.js';
import getName from './getName.js';
import { getSource, setSource } from './source.js';

const getAssetPath = (url, dirname) => {
  const { pathname } = new URL(url);
  const extension = path.extname(pathname) || '.html';
  const assetName = getName(url, extension);
  const assetPath = path.posix.join(dirname, assetName);
  return assetPath;
};

const loadPage = (pageUrl, outDir = '.', options = {}) => {
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

      const $ = load(data);

      const $assets = $('img[src], link[href], script[src]')
        .each((_, asset) => {
          const $asset = $(asset);
          const source = getSource($asset);
          const url = new URL(source, pageUrl);
          setSource($asset, url.toString());
        })
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
    .then(() => {
      const tasks = assetsUrls.map((url) => ({
        title: url,
        task: (_, task) => loadAsset(url, assetsPath).catch(() => {
          task.skip('warning: the asset could not been loaded');
        }),
      }));
      const listr = new Listr(tasks, {
        concurrent: true,
        exitOnError: false,
        renderer: 'silent',
        ...options,
      });
      return listr.run();
    })
    .then(() => ({ filepath }));

  return result;
};

export default (pageUrl, outDir, options) => new Promise((resolve) => {
  resolve(loadPage(pageUrl, outDir, options));
}).catch((err) => {
  throw new LoaderError(err);
});
