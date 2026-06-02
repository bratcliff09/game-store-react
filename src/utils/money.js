function applyDiscount(price, discount) {
  const finalPrice = getFinalPrice(price, discount);
  return formatPrice(finalPrice);
}

export function getFinalPrice(price, discount) {
  const discuontedPrice = price * (1 - discount);
  let finalPrice = discuontedPrice.toFixed(2); //returns string
  return parseFloat(finalPrice);
}

export function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function saleToPercentage(saleFloat) {
  return "-" + (saleFloat * 100).toFixed(0).toString() + "%";
}
