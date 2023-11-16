import fs from 'fs/promises';
import path from 'path';
import client from '../vendor/httpClient.js';
import log from '../vendor/logger.js';
import getConfig from './getConfig.js';
import getName from './getName.js';

const loadAsset = (assetUrl, outDir, overrides = {}) => {
  const { pathname } = new URL(assetUrl);
  const extension = path.extname(pathname) || '.html';

  const config = {
    ...getConfig(extension),
    ...overrides,
  };

  log('loading asset from %s with %o', assetUrl, config);

  const result = client.get(assetUrl, config)
    .then(({ data, status }) => {
      log('succeeded (%d, %s)', status, assetUrl);
      const assetName = getName(assetUrl, extension);
      const assetPath = path.join(outDir, assetName);
      log('saving asset as %s', assetName);
      return fs.writeFile(assetPath, data);
    });

  return result;
};

export default loadAsset;
