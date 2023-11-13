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

export { getSource, setSource };
