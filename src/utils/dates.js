export function isProductReleased(productReleaseDate) {
  const todaysDate = new Date();
  const releaseDate = new Date(productReleaseDate + " 00:00:00");
  return todaysDate >= releaseDate;
}
