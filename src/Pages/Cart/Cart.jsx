import { React, useEffect, useState, useRef } from "react";
import styles from "./Cart.module.css";
import { formatPrice, getFinalPrice } from "../../utils/money";
import { Link } from "react-router";
import TryAgain from "../../Components/TryAgain/TryAgain";
import { getCart, removeFromCart } from "../../utils/cart";

function Cart() {
  const STATE = { LOADING: 0, NO_CART: 1, FULL_CART: 2, NETWORK_ERROR: 3 };
  const [currentState, setCurrentState] = useState(STATE.LOADING);
  const [productData, setProductData] = useState([]);
  const [productPlatforms, setProductPlatforms] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  const SALES_TAX = 0.06;
  const SHIPPING = 3;

  useEffect(() => {
    wrapper();

    async function wrapper() {
      await fetchProcess();
    }
  }, []);

  async function fetchProcess() {
    const cart = getCart();
    if (cart.length === 0) {
      setCurrentState(STATE.NO_CART);
      return;
    }

    let results = [];
    try {
      await fetch("/api/game/cart", {
        method: "POST",
        body: JSON.stringify({
          cart: cart,
        }),
      })
        .then((res) => {
          const { status } = res;
          const { errors } = res.headers.map;
          if (status === 400) throw new Error(status, { cause: errors });
          else if (status === 500) throw new Error(status);

          return res.json();
        })
        .then((json) => {
          results = json.products;
        });
    } catch ({ name, message, cause }) {
      if (message === "500") {
        setCurrentState(STATE.NETWORK_ERROR);
        return;
      } else if (message === "400") {
        console.error(name, message, cause);
      }
    }

    const platformsArr = [];
    for (let i = 0; i < results.length; i++) {
      // Push null rather than not including it
      // Otherwise when removing from cart we'd potentially remove a different item

      // Check if product has the given platform
      const { platform: platformValue } = cart[i];

      //   console.log(results[i]);
      if (!results[i]) {
        platformsArr.push(null);
        continue;
      }

      const platform = results[i].platform.find(
        (element) => element.value === platformValue,
      );
      if (!platform) {
        results[i] = null;
        platformsArr.push(null);
        continue;
      }
      platformsArr.push(platform.name);
    }
    setProductData(results);
    setProductPlatforms(platformsArr);

    calculateSubtotal(results);

    if (results.length > 0) setCurrentState(STATE.FULL_CART);
  }

  function calculateSubtotal(productData) {
    let subtotal = 0;
    for (const product of productData) {
      if (!product) continue;
      subtotal += getFinalPrice(product.price, product.sale);
    }
    setSubtotal(subtotal);
  }

  function onDelete(index) {
    if (productData.length === 1) {
      removeFromCart(0);
      setCurrentState(STATE.NO_CART);
      setProductData([]);
      setProductPlatforms([]);
      setSubtotal(0);
      return;
    }

    //Remove from cart
    removeFromCart(index);

    //Remove from state
    const newProductData = removeIndexFromArray(productData, index);
    setProductData(newProductData);
    setProductPlatforms(removeIndexFromArray(productPlatforms, index));

    //Recalculate price
    calculateSubtotal(newProductData);

    function removeIndexFromArray(arr, index) {
      return arr.slice(0, index).concat(arr.slice(index + 1));
    }
  }

  //#region Render
  function getMain_LOADING() {
    return (
      <>
        <div id="grid-wrapper" className={styles.grid_wrapper}>
          <div id="items" className={styles.items}>
            <ul>
              <li className={styles.product_game}>
                <div className="skeleton">
                  <img src={null} />
                </div>
                <div>
                  <p className="skeleton">Nier Automata Game of the YorHA</p>
                  <div className="platform">
                    <p>Platform</p>
                    <p className="skeleton">Playstation 5</p>
                  </div>
                  <button>Delete</button>
                </div>
                <p className="skeleton">$69.99</p>
              </li>
            </ul>
          </div>
          <div id="order-summary" className={styles.order_summary}>
            <div>
              <div id="subtotal">
                <p>Subtotal</p>
                <p className="skeleton">$59.99</p>
              </div>
              <div id="shipping">
                <p>Shipping</p>
                <p className="skeleton">$6.99</p>
              </div>
              <div id="tax">
                <p>Tax</p>
                <p className="skeleton">$1.99</p>
              </div>
            </div>
            <div id="total-cost">
              <p>Total</p>
              <p className="skeleton">$65.99</p>
            </div>
            <Link to={"/checkout"}>Checkout</Link>
          </div>
        </div>
      </>
    );
  }

  function getMain_FULLCART() {
    return (
      <>
        <div id="grid-wrapper" className={styles.grid_wrapper}>
          <div id="items" className={styles.items}>
            <ul>
              {productData.map((product, index) => {
                if (!product) return "";
                return (
                  <li key={index} className={styles.product_game}>
                    <div>
                      <img
                        src={`/product/${product.images.path}/${product.images.main}`}
                      />
                    </div>
                    <div>
                      <Link to={`/product/${product.id}`}>{product.title}</Link>
                      <div className="platform">
                        <p>Platform</p>
                        <p>{productPlatforms[index]}</p>
                      </div>
                      <button onClick={() => onDelete(index)}>Delete</button>
                    </div>
                    <p>
                      {formatPrice(getFinalPrice(product.price, product.sale))}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
          <div id="order-summary" className={styles.order_summary}>
            <div>
              <div id="subtotal">
                <p>Subtotal</p>
                <p>{formatPrice(subtotal)}</p>
              </div>
              <div id="shipping">
                <p>Shipping</p>
                <p>{formatPrice(SHIPPING)}</p>
              </div>
              <div id="tax">
                <p>Tax</p>
                <p>{formatPrice(subtotal * SALES_TAX)}</p>
              </div>
            </div>
            <div id="total-cost">
              <p>Total</p>
              <p>{formatPrice(subtotal + SHIPPING + subtotal * SALES_TAX)}</p>
            </div>
            <Link to={"/checkout"}>Checkout</Link>
          </div>
        </div>
      </>
    );
  }

  //#endregion

  return (
    <main>
      <title>Cart | GameStore</title>
      <h1 className={styles.header}>Cart</h1>
      {currentState === STATE.LOADING && getMain_LOADING()}
      {currentState === STATE.FULL_CART && getMain_FULLCART()}
      {currentState === STATE.NO_CART && (
        <p className={styles.empty_cart}>Your Cart is Empty</p>
      )}
      {currentState === STATE.NETWORK_ERROR && (
        <TryAgain tryAgain={fetchProcess} />
      )}
    </main>
  );
}

export default Cart;
