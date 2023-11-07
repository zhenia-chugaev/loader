const isLocalAsset = (assetUrl, origin) => {
  const url = new URL(assetUrl);
  return url.origin === origin;
};

export default isLocalAsset;
