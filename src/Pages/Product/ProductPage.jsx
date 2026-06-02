import { React, useEffect, useState, useRef } from "react";
import styles from "./ProductPage.module.css";
import { useParams, useNavigate, Link } from "react-router";
import { addGameToCart, isProductInCart } from "../../utils/cart";
import Carousel from "../../Components/Product_Carousel/Carousel";
import {
  formatPrice,
  getFinalPrice,
  saleToPercentage,
} from "../../utils/money";
import TryAgain from "../../Components/TryAgain/TryAgain";

function ProductPage() {
  const { id: paramID } = useParams();
  const navigate = useNavigate();

  const [productID, setProductID] = useState(validateID);
  const [productData, setProductData] = useState();
  const [isInCart, setIsInCart] = useState(false);
  const [isNetworkError, setIsNetworkError] = useState(false);

  const ref_platform_fieldset = useRef(null);

  urlChecker();

  //#region URL
  function validateID() {
    const num = parseInt(paramID);
    return Number.isNaN(num) ? -1 : num;
  }

  // Check if the url was changed manually by the user
  function urlChecker() {
    const id = parseInt(paramID);
    if (Number.isNaN(id)) {
      redirect404();
      return;
    }

    if (id !== productID) {
      setProductID(id);
    }
  }

  function redirect404() {
    navigate("/anywhere");
  }
  //#endregion

  // The init useEffect. Also handles state when the url is manually changed
  useEffect(() => {
    // Redirect if ID was invalid
    if (productID < 0) redirect404();

    // Fetch data and set state
    fetchProcess();
  }, [productID]);

  async function fetchProcess() {
    try {
      await fetch("/api/game/" + productID, {
        method: "GET",
      })
        .then((res) => {
          const { status } = res;
          if (status === 400 || status === 404 || status === 500) {
            throw new Error(status);
          }
          return res.json();
        })
        .then((json) => {
          setProductData(json.product);
        });

      setIsNetworkError(false);
      const isInCart = isProductInCart(productID);
      setIsInCart(isInCart);
    } catch ({ name, message }) {
      if (message === "500") {
        setIsNetworkError(true);
      } else if (message === "400") {
        console.error("400 Error");
        console.log(
          "You somehow bypassed the initial check and passed a non-integer as the productID",
        );
        console.log("ProductID", productID);
      } else if (message === "404") {
        redirect404();
      }
      return;
    }
  }

  //#region Carousel
  let carouselPaths = [];
  function getCarouselMain() {
    const { main, carousel, path } = productData.images;
    const { title } = productData;
    // Used later by carousel-slider
    carouselPaths = [main].concat(carousel);
    carouselPaths = carouselPaths.map((element) => path + "/" + element);

    let i = 0;
    return carouselPaths.map((path, index) => (
      <li key={i++}>
        <img src={`product/${path}`} alt={"Slide " + (index + 1)} />
      </li>
    ));
  }

  //#endregion

  //#region Platform Selection
  let selectedPlatformIndex = 1;
  function selectPlatform(evnt, index) {
    if (index < 1) {
      return;
    }

    ref_platform_fieldset.current.children[
      selectedPlatformIndex
    ].classList.remove(styles.platform_selected);
    evnt.target.classList.toggle(styles.platform_selected);
    selectedPlatformIndex = index;
  }
  //#endregion

  //#region Cart
  function addToCart() {
    if (!productData) return;

    let platformInternalValue = "";
    try {
      platformInternalValue =
        ref_platform_fieldset.current.children[
          selectedPlatformIndex
        ].getAttribute("internal_value");
    } catch (e) {
      console.error(e);
    }

    if (platformInternalValue === "") {
      console.error("Selected platform cannot be determined");
      return;
    }

    addGameToCart(productID, platformInternalValue);
    setIsInCart(true);
  }
  //#endregion

  //#region Main
  function getMain_Loading() {
    return (
      <>
        <div id="game-summary" className={styles.game_summary}>
          <aside className={styles.carousel_aside}>
            <Carousel></Carousel>
          </aside>
          <section>
            <h1 className="skeleton">
              Nier Automata: Game of the YorHA Edition
            </h1>
            <fieldset>
              <legend>Platform</legend>
            </fieldset>
            <div className={`${styles.price} skeleton`}>
              <p className="final-price">$26.99</p>
              <p className="discount">-50%</p>
              <p className="original-price">$45.99</p>
            </div>
            <a
              href="#"
              id="cta-btn"
              className={`${styles.cta_btn} ${styles.add_to_cart}`}
              role="button"
            >
              Add To Cart
            </a>
          </section>
        </div>
        <div id="specifics" className={styles.specifics}>
          <h2>Specifications</h2>
          <div>
            <div id="specifics-left">
              <div>
                <p>Developer</p>
                <p className="skeleton">Dev Name</p>
              </div>
              <div>
                <p>Publisher</p>
                <p className="skeleton">Publisher Name</p>
              </div>
              <div>
                <p>Release</p>
                <p className="skeleton">Jan 22, 2026</p>
              </div>
            </div>
            <div id="specifics-right">
              <div id="esrb" className={styles.esrb}>
                <div className="skeleton"></div>
                <ul>
                  <li>
                    <p className="skeleton">Descriptor 1</p>
                  </li>
                  <li>
                    <p className="skeleton">Descriptor 2</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div id="game-description" className={styles.game_description}>
          <h2>Description</h2>
          <p className="skeleton">
            Lorem ipsum dolor sit amet consectetur, Neque dolorem magni vero qui
            totam!
          </p>
        </div>
      </>
    );
  }

  function getMain_Perfect() {
    let date = new Date(productData.releaseDate + " 00:00:00");
    date = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return (
      <>
        <div id="game-summary" className={styles.game_summary}>
          <aside className={styles.carousel_aside}>
            <Carousel>{getCarouselMain()}</Carousel>
          </aside>
          <section>
            <h1>{productData.title}</h1>
            <fieldset ref={ref_platform_fieldset}>
              <legend>Platform</legend>
              {productData.platform.map((platform, index) => {
                return (
                  <input
                    key={index}
                    type="button"
                    value={platform.name}
                    internal_value={platform.value}
                    onClick={(evnt) => selectPlatform(evnt, index + 1)}
                    className={index == 0 ? styles.platform_selected : ""}
                  />
                );
              })}
            </fieldset>

            <div className={styles.price}>
              <p className="final-price">
                {formatPrice(
                  getFinalPrice(productData.price, productData.sale),
                )}
              </p>
              {productData.sale > 0 && (
                <>
                  <p className={styles.discount}>
                    {saleToPercentage(productData.sale)}
                  </p>
                  <p
                    className={styles.original_price}
                    aria-roledescription="Original Price"
                  >
                    {formatPrice(productData.price)}
                  </p>
                </>
              )}
            </div>

            {!isInCart ? (
              <button
                id="cta-btn"
                className={styles.add_to_cart}
                onClick={addToCart}
              >
                Add To Cart
              </button>
            ) : (
              <Link to="/cart" className={styles.go_to_cart}>
                Go To Cart
              </Link>
            )}
          </section>
        </div>
        <div id="specifics" className={styles.specifics}>
          <h2>Specifications</h2>
          <div>
            <div id="specifics-left">
              <div>
                <p>Developer</p>
                <p>{productData.developer}</p>
              </div>
              <div>
                <p>Publisher</p>
                <p>{productData.publisher}</p>
              </div>
              <div>
                <p>Release</p>
                <p>{date}</p>
              </div>
            </div>
            <div id="specifics-right">
              <div id="esrb" className={styles.esrb}>
                <img src={"esrb/" + productData.esrb.rating.img} />
                <ul>
                  {productData.esrb.content.map((descriptor, index) => (
                    <li key={index}>
                      <p>{descriptor}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div id="game-description" className={styles.game_description}>
          <h2>Description</h2>
          <p>{productData.description}</p>
        </div>
      </>
    );
  }
  //#endregion

  return (
    <main className={styles.main}>
      {productData && <title>{productData.title + " | GameStore"}</title>}
      {isNetworkError ? (
        <TryAgain tryAgain={fetchProcess} />
      ) : productData ? (
        getMain_Perfect()
      ) : (
        getMain_Loading()
      )}
    </main>
  );
}

export default ProductPage;
