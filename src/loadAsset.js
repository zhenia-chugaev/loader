import fs from 'fs/promises';
import path from 'path';
import client from './httpClient.js';
import getConfig from './getConfig.js';
import getName from './getName.js';

const loadAsset = (assetUrl, outDir, overrides = {}) => {
  const { pathname } = new URL(assetUrl);
  const extension = path.extname(pathname) || '.html';

  const config = {
    ...getConfig(extension),
    ...overrides,
  };

  const result = client.get(assetUrl, config)
    .then(({ data }) => {
      const assetName = getName(assetUrl, extension);
      const assetPath = path.join(outDir, assetName);
      return fs.writeFile(assetPath, data);
    });

  return result;
};

export default loadAsset;
