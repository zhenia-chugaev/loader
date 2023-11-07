import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import getConfig from './getConfig.js';
import getName from './getName.js';

const loadAsset = (assetUrl, outDir, overrides = {}) => {
  const { pathname } = new URL(assetUrl);
  const extension = path.extname(pathname);

  const config = {
    ...getConfig(extension),
    ...overrides,
  };

  const result = axios.get(assetUrl, config)
    .then(({ data }) => {
      const imageName = getName(assetUrl);
      const imagePath = path.join(outDir, imageName);
      return fs.writeFile(imagePath, data);
    });

  return result;
};

export default loadAsset;
