import React, { useEffect, useState, useRef } from "react";
import styles from "./Carousel.module.css";
import { Link } from "react-router";
import TryAgain from "../TryAgain/TryAgain";
import { isProductReleased } from "../../utils/dates";
import {
  formatPrice,
  getFinalPrice,
  saleToPercentage,
} from "../../utils/money";

function Carousel(props) {
  const STATE = { LOADING: 0, HAPPY_PATH: 1, NETWORK_ERROR: 2 };
  const [productData, setProductData] = useState([]);
  const [st_carousel, setSt_carousel] = useState(STATE.LOADING);

  const ref_carouselMain = useRef(null);
  const ref_slideSelect = useRef(null);

  const SLIDE_TYPE = { PRODUCT_GAME: 0, NON_PRODUCT: 1 };
  const slides = [
    {
      title: "Resident Evil Requiem",
      description:
        "The 9th installment in this long-running horror franchise is finally here ",
      imgPath: "re9.webp", //Image name in /public/home/heroCarousel/
      type: SLIDE_TYPE.PRODUCT_GAME,
      link: "/product/14",
      productID: 14,
    },

    {
      title: "A Hat in Time",
      description: "Now on sale!",
      imgPath: "hat.webp",
      type: SLIDE_TYPE.PRODUCT_GAME,
      link: "/product/2",
      productID: 2,
    },
    {
      title: "Kingdom Hearts 4",
      description: "Coming Soon!!",
      imgPath: "kh4.webp",
      type: SLIDE_TYPE.PRODUCT_GAME,
      link: "/product/13",
      productID: 13,
    },
    {
      title: "More Merch On the Way!",
      description: "Stay Tuned for More",
      imgPath: "Illustration.webp",
      type: SLIDE_TYPE.NON_PRODUCT,
      link: undefined,
    },
  ];

  useEffect(() => {
    wrapper();
    async function wrapper() {
      await fetchCarousel();
    }
  }, []);

  async function fetchCarousel() {
    try {
      await fetch("/api/game/ids", {
        method: "POST",
        body: JSON.stringify({
          ids: slides.map((slide) => slide.productID),
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
          setProductData(json.products);
          setSt_carousel(STATE.HAPPY_PATH);
        });
    } catch ({ name, message, cause }) {
      if (message === "500") {
        setSt_carousel(STATE.NETWORK_ERROR);
        return;
      } else if (message === "400") {
        console.error(name, message, cause);
      }
    }
  }

  //#region Carousel Main
  function createSlides() {
    const tmpArr = [];
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      if (slide.type === SLIDE_TYPE.PRODUCT_GAME) {
        createProductSlide(slide, i);
      } else {
        createNonProductSlide(slide, i);
      }
    }

    return tmpArr;

    function createNonProductSlide(slide, index) {
      const imgPath = "/home_page/heroCarousel/" + slide.imgPath;

      tmpArr.push(
        <li className={styles.slide} key={index}>
          <Link to={undefined}>
            <div>
              <img src={imgPath} />
            </div>
            <div className={styles.product_info}>
              <p className="title">{slide.title}</p>
              <p className="description">{slide.description}</p>
            </div>
          </Link>
        </li>,
      );
    }

    function createProductSlide(slide, index) {
      const imgPath = "/home_page/heroCarousel/" + slide.imgPath;
      const product = productData[index];

      const link = "/product/" + slide.productID;

      const isOnSale = product.sale > 0;
      const isReleased = isProductReleased(product.releaseDate);
      const finalPrice = formatPrice(
        getFinalPrice(product.price, product.sale),
      );
      const salePercentage = isOnSale ? saleToPercentage(product.sale) : "";
      const originalPrice = formatPrice(product.price);
      const ariaLabel = isOnSale
        ? `${salePercentage.substring(1)} discount, Current Price: ${finalPrice}, Original Price: ${originalPrice}`
        : "";

      tmpArr.push(
        <li className={styles.slide} key={index}>
          <Link to={link}>
            <div>
              <img src={imgPath} />
            </div>
            <div className={styles.product_info}>
              <p className="title">{slide.title}</p>
              <p className="description">{slide.description}</p>
              <div className={styles.cta_info}>
                <button>
                  {isReleased ? "Available Now" : "Pre-Order Now"}
                </button>
                <div
                  className={styles.price}
                  role="link"
                  aria-label={ariaLabel}
                >
                  <p className="final-price">{finalPrice}</p>
                  {isOnSale && (
                    <div className="sale">
                      <p>{salePercentage}</p>
                      <p>{originalPrice}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </li>,
      );
    }
  }

  //#endregion

  //#region Slide Selecting
  let currentPage = 0;
  function setPageRelative(dir) {
    let finalIndex;
    if (dir > 0) {
      finalIndex = currentPage + 1 >= slides.length ? 0 : currentPage + 1;
    } else {
      finalIndex = currentPage - 1 < 0 ? slides.length - 1 : currentPage - 1;
    }

    setPage(finalIndex);
  }

  function setPage(index) {
    if (st_carousel !== STATE.HAPPY_PATH) return;

    const { offsetLeft: mainOffsetLeft } = ref_carouselMain.current;
    const { offsetLeft } = ref_carouselMain.current.children[index];
    const slideX = offsetLeft - mainOffsetLeft;

    // Scroll to Slide
    ref_carouselMain.current.scrollTo({
      left: slideX,
      behavior: "smooth",
    });

    // Change the Slide Select buttons
    ref_slideSelect.current.children[currentPage].classList.remove(
      styles.selected,
    );
    ref_slideSelect.current.children[index].classList.toggle(styles.selected);
    currentPage = index;
  }

  //#endregion

  return (
    <div id="hero-carousel" className={styles.hero_carousel}>
      <button
        className={styles.btn}
        aria-label="carousel-back"
        onClick={() => setPageRelative(-1)}
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>
      {st_carousel === STATE.NETWORK_ERROR && (
        <TryAgain tryAgain={fetchCarousel} />
      )}
      {st_carousel === STATE.LOADING && (
        <ul
          id="carousel-main"
          className={styles.carousel_main}
          aria-label="Featured Products"
        >
          <li className="skeleton"></li>
        </ul>
      )}
      {st_carousel === STATE.HAPPY_PATH && (
        <ul
          id="carousel-main"
          className={styles.carousel_main}
          aria-label="Featured Products"
          ref={ref_carouselMain}
        >
          {createSlides()}
        </ul>
      )}

      <button
        className={styles.btn}
        aria-label="carousel-forward"
        onClick={() => setPageRelative(1)}
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
      <ul
        id="carousel-slide-select"
        className={styles.slide_select}
        ref={ref_slideSelect}
      >
        {st_carousel === STATE.HAPPY_PATH &&
          slides.map((slide, index) => (
            <li
              className={index === 0 ? styles.selected : undefined}
              key={index}
            >
              <button
                aria-label={`Slide ${index + 1} of ${slides.length}`}
                onClick={() => setPage(index)}
              ></button>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Carousel;
