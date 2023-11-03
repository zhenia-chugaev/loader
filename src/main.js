import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import { load } from 'cheerio';
import loadAsset from './loadAsset.js';
import { getName, getAssetName } from './getName.js';

const loadPage = (pageUrl, outDir = '.') => {
  let filepath;
  let assetsPath;
  let imagesUrls;

  const result = axios.get(pageUrl)
    .then(({ data }) => {
      const $ = load(data, { baseURI: pageUrl });

      const filename = getName(pageUrl, '.html');
      filepath = path.resolve(process.cwd(), outDir, filename);

      const dirname = getName(pageUrl, '_files');
      assetsPath = path.resolve(process.cwd(), outDir, dirname);

      const $images = $('img');

      imagesUrls = $images
        .map((_, img) => $(img).prop('src'))
        .toArray();

      $images.each((_, img) => {
        const $image = $(img);
        const imageName = getAssetName($image.prop('src'));
        const imagePath = path.posix.join(dirname, imageName);
        $image.attr('src', imagePath);
      });

      return fs.writeFile(filepath, $.html());
    })
    .then(() => fs.mkdir(assetsPath))
    .then(() => Promise.all(
      imagesUrls.map((url) => loadAsset(url, assetsPath)),
    ))
    .then(() => ({ filepath }));

  return result;
};

export default loadPage;
