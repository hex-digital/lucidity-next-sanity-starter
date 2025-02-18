/**
 * Get the URL of the document as it is needed to access it on the frontend.
 * @param pathname The pathname or slug of the document, as it is stored in the CMS.
 * @param _documentType The type of the document.
 */
export function getDocumentUrlPrefix(pathname: string, _documentType?: string) {
  const path = pathname;

  // If certain documents don't contain the full URL then use this function to resolve them.
  // For example:
  // if (documentType === DOCUMENT.SERVICE) {
  //   path = `/service/${pathname}`;
  // }

  return path.replaceAll('//', '/');
}

/**
 * Get the URL of the document as it is stored in the CMS.
 * This function is useful in cases where the actual page URL is different to the slug in the CMS,
 */
export function getCmsDocumentUrl(pathname: string, _documentType?: string) {
  return pathname.replaceAll('//', '/');
}
