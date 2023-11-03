import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import { load } from 'cheerio';

const regexp = /[^a-zA-Z0-9]/g;
const sep = '-';

const getName = (url, suffix = '') => {
  const { hostname, pathname, search } = new URL(url);
  const name = [
    hostname,
    pathname === '/' ? '' : pathname,
    search,
  ].join('').replaceAll(regexp, sep);
  return `${name}${suffix}`;
};

const getAssetName = (url) => {
  const { hostname, pathname } = new URL(url);
  const basename = path.basename(pathname);
  const dirname = path.dirname(pathname);
  const name = [hostname, dirname].join('').replaceAll(regexp, sep);
  return `${name}${sep}${basename}`;
};

const loadImage = (imageUrl, outDir) => {
  const options = {
    responseType: 'arraybuffer',
  };

  const result = axios.get(imageUrl, options)
    .then(({ data }) => {
      const imageName = getAssetName(imageUrl);
      const imagePath = path.join(outDir, imageName);
      return fs.writeFile(imagePath, data);
    });

  return result;
};

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
        const imagePath = path.join(dirname, imageName);
        $image.attr('src', imagePath);
      });

      return fs.writeFile(filepath, $.html());
    })
    .then(() => fs.mkdir(assetsPath))
    .then(() => Promise.all(
      imagesUrls.map((url) => loadImage(url, assetsPath)),
    ))
    .then(() => ({ filepath }));

  return result;
};

export default loadPage;
