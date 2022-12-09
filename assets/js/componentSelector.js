// Custom Component Selector

export const $ = (tagToSelect, nodeContainer = document) => {
  const selectedElement = nodeContainer.querySelectorAll(tagToSelect);

  if (selectedElement.length > 1) return selectedElement;
  else if (selectedElement.length === 1) return selectedElement[0];
  else return null;
};
