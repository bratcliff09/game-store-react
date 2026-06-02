const STORAGE_NAME = "cart";

/*
cart setup [
    {id: 0, platform: PLATFORM.PS},
    {id: 1, platform: PLATFORM.NS}
]
*/

export function getCart() {
  const cart = JSON.parse(localStorage.getItem(STORAGE_NAME));
  if (!cart) {
    return [];
  } else {
    return cart;
  }
}

export function addGameToCart(productID, platformValue) {
  const cart = getCart();
  const obj = { id: productID, platform: platformValue };
  cart.push(obj);
  localStorage.setItem(STORAGE_NAME, JSON.stringify(cart));

  //Update cart number in the DOM
  setCartNumber(cart.length, true);
}

export async function removeFromCart(indexInCart) {
  const cart = getCart();
  cart.splice(indexInCart, 1);
  localStorage.setItem(STORAGE_NAME, JSON.stringify(cart));

  //Update cart number in the DOM
  setCartNumber(cart.length);
}

/*
export function clearCart() {
  localStorage.setItem(STORAGE_NAME, JSON.stringify([]));
}
  

export function getCartLength() {
  return getCart().length;
}
  */

export function isProductInCart(productID) {
  const cart = getCart();
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === productID) {
      return true;
    }
  }

  return false;
}

// Cart Animations in Header
function playAnimation(cartDOM) {
  const keyFrames = new KeyframeEffect(
    cartDOM,
    [
      { filter: "brightness(1)" },
      { filter: "brightness(1.75)" },
      { filter: "brightness(1)" },
    ],
    {
      duration: 1250,
      direction: "normal",
      easing: "ease-in-out",
      iterations: 1,
    },
  );
  new Animation(keyFrames).play();
}

function setCartNumber(num, isNumIncrease = false) {
  const cartDOM = document.querySelector("#my-header #cart p");
  if (!cartDOM) return;

  let txt = "";
  if (num > 10) {
    txt = "+";
  } else if (num > 0) {
    txt = num.toString();
  }
  cartDOM.innerText = txt;
  if (isNumIncrease) playAnimation(cartDOM);
}
