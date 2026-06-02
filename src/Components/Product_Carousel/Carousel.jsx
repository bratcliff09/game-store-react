import { React, useRef } from "react";
import styles from "./Carousel.module.css";

function Carousel(props) {
  const ref_carouselMain_ul = useRef(null);
  const ref_carouselSlider_ul = useRef(null);
  let currCarouselPage = 0;

  function createSlides() {
    const pathsArr = props.children.map(
      (element) => element.props.children.props.src,
    );

    return pathsArr.map((path, index) => (
      <li
        className={index === 0 ? styles.carousel_selected : undefined}
        key={index}
      >
        <button
          onClick={() => carouselSetPage(index)}
          aria-label={`Select Slide ${index + 1}`}
        >
          <img src={path} />
        </button>
      </li>
    ));
  }

  function onClickCarouselButton(isBack) {
    const carouselLength = props.children.length;
    let finalIndex = isBack ? currCarouselPage - 1 : currCarouselPage + 1;
    if (isBack) {
      if (finalIndex < 0) {
        finalIndex = carouselLength - 1;
      }
    } else {
      if (finalIndex >= carouselLength) {
        finalIndex = 0;
      }
    }
    carouselSetPage(finalIndex);
  }

  function carouselSetPage(pageIndex) {
    // Scroll to the slide's counterpart in carouselMain
    const { offsetLeft: main_parentOffsetLeft } = ref_carouselMain_ul.current;
    const { offsetLeft: main_offsetLeft } =
      ref_carouselMain_ul.current.children.item(pageIndex);

    ref_carouselMain_ul.current.scrollTo({
      left: main_offsetLeft - main_parentOffsetLeft,
      behavior: "smooth",
    });

    // Scroll to the slide in carouselSlide if it is not in view
    const { offsetLeft: slide_parentOffsetLeft } =
      ref_carouselSlider_ul.current;
    let { offsetLeft: slide_offsetLeft, offsetWidth: slide_offsetWidth } =
      ref_carouselSlider_ul.current.children[pageIndex];
    slide_offsetLeft = slide_offsetLeft - slide_parentOffsetLeft;
    const slide_offsetRight = slide_offsetLeft + slide_offsetWidth;

    const boundLeft = ref_carouselSlider_ul.current.scrollLeft;
    const boundRight = boundLeft + ref_carouselSlider_ul.current.offsetWidth;

    if (slide_offsetLeft < boundLeft) {
      ref_carouselSlider_ul.current.scrollTo({
        left: slide_offsetLeft,
        behavior: "smooth",
      });
    } else if (slide_offsetRight > boundRight) {
      const adjustValue = slide_offsetRight - boundRight;
      ref_carouselSlider_ul.current.scrollBy({
        left: adjustValue + 10,
        behavior: "smooth",
      });
    }

    // Update css
    ref_carouselSlider_ul.current.children[currCarouselPage].classList.remove(
      styles.carousel_selected,
    );
    currCarouselPage = pageIndex;

    ref_carouselSlider_ul.current.children[pageIndex].classList.toggle(
      styles.carousel_selected,
    );
  }

  return (
    <>
      <div id="carousel-main" className={styles.carousel_main}>
        <ul ref={ref_carouselMain_ul}>
          {props.children ? props.children : <li className="skeleton"></li>}
        </ul>
      </div>
      <div id="carousel-slider" className={styles.carousel_slider}>
        <button
          aria-label="carousel-back"
          onClick={() => onClickCarouselButton(true)}
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <ul aria-label="Carousel slide select" ref={ref_carouselSlider_ul}>
          {props.children ? createSlides() : <li className="skeleton"></li>}
        </ul>
        <button
          aria-label="carousel-forward"
          onClick={() => onClickCarouselButton(false)}
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </>
  );
}

export default Carousel;
