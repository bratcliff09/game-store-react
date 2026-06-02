import { React, useEffect, useState, useRef } from "react";
import "./Search.css";
import style from "./Search.module.css";
import "../../skeleton.css";
import ProductItem from "../../Components/ProductItem/ProductItem";
import { useSearchParams } from "react-router";
import TryAgain from "../../Components/TryAgain/TryAgain";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [results, setResults] = useState([]); // The products' data
  const [allFilters, setAllFilters] = useState({}); //ALL available filter options
  const [selectedFilters, setSelectedFilters] = useState({
    platform: ["ns"], //[platform.value]
  }); //Filters selected by user

  const [isNetworkError, setIsNetworkError] = useState(false); // If there was an error calling the server
  const [isInitialRenderDone, setIsInitialRenderDone] = useState(false); // Has the first render finished

  const ref_aside = useRef(null); //Opens the mobileOnlyAside
  const ref_asideForm = useRef(null);
  const ref_inputMinPrice = useRef(null);
  const ref_inputMaxPrice = useRef(null);

  const ref_isFetching = useRef(false);

  // Used inplace of a "componentOnMount useEffect[]" since both are called on start anyways.
  // Called when url is manually changed by the user rather than changed via aside filter
  useEffect(() => {
    // console.log("UE_searchParams");

    // Get search query
    tmpSelectedFilterObj = { q: searchParams.get("q") };

    //Get other filters
    for (const [key, value] of searchParams) {
      switch (key) {
        case "platform":
        case "rating":
          if (tmpSelectedFilterObj[key]) {
            tmpSelectedFilterObj[key].push(value);
          } else {
            tmpSelectedFilterObj[key] = [value];
          }
          break;
        case "minPrice":
        case "maxPrice":
          const valueToInt = parseInt(value);
          if (!Number.isNaN(valueToInt)) {
            tmpSelectedFilterObj[key] = valueToInt;
          }
          break;
      }
    }

    //Call the rest of the filtering-fetching process
    wrapper();

    async function wrapper() {
      await filterProcess();
      setSelectedFilters(tmpSelectedFilterObj);
      setIsInitialRenderDone(true);
    }

    return () => {};
  }, [searchParams]);

  //#region Aside Filter

  // Based on the given filter category, returns an array of checkbox fieldset inputs
  // User selected options for the given category are display first, then unselected options are displayed
  function createFilterOptions(filterCategory) {
    // Check if category exists
    if (!allFilters[filterCategory]) {
      return;
    }

    // Two arrays: one of user checked inputs, the other of non-user checked inputs
    let checkedArr, nonCheckedArr;
    if (!selectedFilters[filterCategory]) {
      checkedArr = [];
      nonCheckedArr = allFilters[filterCategory];
    } else {
      checkedArr = allFilters[filterCategory].filter((option) =>
        selectedFilters[filterCategory].includes(option.value),
      );
      nonCheckedArr = allFilters[filterCategory].filter(
        (option) => !selectedFilters[filterCategory].includes(option.value),
      );
    }

    // Sort based on filter category
    // allFilters is already sorted, thus, so is nonCheckedArr
    switch (filterCategory) {
      case "platform":
        checkedArr = checkedArr.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "rating":
        checkedArr = checkedArr.sort((a, b) => a.id - b.id);
        break; // Sort based on ID
    }

    // Map into checkbox elements
    checkedArr = checkedArr.map((option) =>
      createCheckbox(option.value, option.name, true, option.id),
    );
    nonCheckedArr = nonCheckedArr.map((option) =>
      createCheckbox(option.value, option.name, false, option.id),
    );

    // Concat both with the selectedFiltesr being displayed first
    return checkedArr.concat(nonCheckedArr);
  }

  function createCheckbox(value, name, isChecked, id) {
    return (
      <li key={id}>
        <label className="custom-checkbox">
          <input type="checkbox" value={value} checked={isChecked} readOnly />
          <div>{name}</div>
        </label>
      </li>
    );
  }

  //#endregion

  //#region Mobile-only Filter Menu
  function setMobileFilters(setOpen) {
    if (setOpen) {
      ref_aside.current.classList.toggle("open");
    } else {
      ref_aside.current.classList.remove("open");
    }
  }
  //#endregion

  //#region Filtering Process
  let tmpSelectedFilterObj = {};

  // Should be considered the first step in filtering.
  // Update the search params, which in turn triggers its useEffect which
  // fetches and updates state for the entire page
  function updateURL() {
    // Create new search params from the tempSelectedFilters obj
    let newQueryString = "?";
    for (const [key, value] of Object.entries(tmpSelectedFilterObj)) {
      if (!value) continue;
      // console.log(key, value);

      if (Array.isArray(value) && typeof value !== "string") {
        value.forEach((element) => {
          newQueryString += key + "=" + element.toString() + "&";
        });
      } else {
        newQueryString += key + "=" + value.toString() + "&";
      }
    }

    // console.log(newQueryString);
    setSearchParams(newQueryString);
  }

  // Handles fetching from the products from the server and
  // updating available filters based on the results
  async function filterProcess() {
    if (ref_isFetching.current) {
      // console.log("caught");
      return;
    } else {
      ref_isFetching.current = true;
    }

    ref_asideForm.current.inert = true;

    // Fetch the products from the server
    let results;
    try {
      await fetch("/api/game/", {
        method: "POST",
        body: JSON.stringify({ filters: tmpSelectedFilterObj }),
      })
        .then((res) => {
          const { status } = res;
          if (status === 400) throw new Error(status);
          else if (status === 500) throw new Error(status);

          return res.json();
        })
        .then((json) => {
          // console.log(json);
          results = json.products;
        });
    } catch ({ name, message }) {
      if (message === "500") {
        // setSelectedFilters(tmpSelectedFilterObj);
        setIsNetworkError(true);
      } else if (message === "400") {
        console.error("400 Error");
        console.log("filters used in request");
        console.log(tmpSelectedFilterObj);
      }

      ref_isFetching.current = false;
      ref_asideForm.current.inert = false;
      return;
    }

    // Change the available filters based on the returned products
    const availableFilters = getAvailableFiltersFromResults();
    setAllFilters(availableFilters);

    setResults(results);
    if (isNetworkError) setIsNetworkError(false);

    ref_asideForm.current.inert = false;
    ref_isFetching.current = false;

    function getAvailableFiltersFromResults() {
      let platformArr = results.map((product) => product.platform).flat();
      platformArr = helper_getAvailableFilters(platformArr);
      platformArr.sort((a, b) => a.name.localeCompare(b.name)); // Sort Alphabetically

      let ratingArr = results.map((product) => product.esrb.rating);
      ratingArr = helper_getAvailableFilters(ratingArr);
      ratingArr.sort((a, b) => a.id - b.id); // Sort based on ID

      return { platform: platformArr, rating: ratingArr };
    }

    // Gets the unique values from the array
    // params:
    // arr - [{id : #}] Assumes object array with id parameters
    function helper_getAvailableFilters(arr) {
      const mappedArr = arr.map((product) => product.id);
      const returnedArr = [];
      for (let i = 0; i < mappedArr.length; i++) {
        if (mappedArr.indexOf(mappedArr[i]) === i) {
          returnedArr.push(arr[i]);
        }
      }
      return returnedArr;
    }
  }

  //#endregion

  //#region Aside

  //#region Form Events

  function onClickClearButton() {
    tmpSelectedFilterObj = {};
    updateURL();
  }

  // Handles min and max price changes
  function onSubmitForm(evnt) {
    evnt.preventDefault();

    const minPrice = parseInt(ref_inputMinPrice.current.value);
    const maxPrice = parseInt(ref_inputMaxPrice.current.value);

    //Create a deep copy of selectedFilters
    //Apply the new array to it
    tmpSelectedFilterObj = JSON.parse(JSON.stringify(selectedFilters));
    tmpSelectedFilterObj.minPrice = Number.isNaN(minPrice) ? null : minPrice;
    tmpSelectedFilterObj.maxPrice = Number.isNaN(maxPrice) ? null : maxPrice;

    updateURL();
  }

  // Handles platform and rating fieldset changes
  function onFieldsetChange(evnt, filterCategory) {
    let isCategoryPresent = true;
    if (!allFilters[filterCategory]) {
      console.error(
        'Filter Category, "' + filterCategory + '", does not exist',
      );
      return;
    } else if (!selectedFilters[filterCategory]) {
      isCategoryPresent = false;
    }

    const wasChecked = evnt.target.checked;
    const value = evnt.target.value;

    let copyArr = isCategoryPresent
      ? selectedFilters[filterCategory].slice()
      : [];
    // Slice works as long as there's no nested arrays inside the obj property

    // Add / Remove the value from the array in selectedFilters
    if (wasChecked) {
      copyArr.push(value);
    } else {
      let index = -1;
      for (let i = 0; i < copyArr.length; i++) {
        if (copyArr[i] === value) {
          index = i;
          break;
        }
      }

      if (index !== -1) {
        copyArr.splice(index, 1);
      }
    }

    //Create a deep copy of selectedFilters
    //Apply the new array to it
    tmpSelectedFilterObj = JSON.parse(JSON.stringify(selectedFilters));
    tmpSelectedFilterObj[filterCategory] = copyArr;

    updateURL();
  }

  //#endregion
  //#endregion

  //#region Main
  function getMainHeader() {
    let determinant = selectedFilters.q && selectedFilters.q.trim();
    const strResults = determinant ? "Results for " : "Results";
    const hasSkeleton = isInitialRenderDone ? "" : "skeleton";

    return (
      <>
        <span>
          {results && results.length} {strResults}
        </span>
        {determinant && (
          <span className={hasSkeleton}>{selectedFilters.q}</span>
        )}
      </>
    );
  }

  function getMain() {
    //If first render of page
    if (!isInitialRenderDone) {
      return (
        <ul>
          <li className="skeleton"></li>
          <li className="skeleton"></li>
          <li className="skeleton"></li>
        </ul>
      );
    }

    if (isNetworkError) {
      return <TryAgain tryAgain={filterProcess} />;
    }

    //Happy path
    return (
      <ul>
        {results.map((product) => (
          <ProductItem
            key={product.id}
            productID={product.id}
            title={product.title}
            price={product.price}
            sale={product.sale}
            releaseDate={product.releaseDate}
            image={product.images}
          />
        ))}
      </ul>
    );
  }
  //#endregion

  return (
    <div id="main-wrapper">
      <title>Search | GameStore</title>
      <div id="aside-wrapper" ref={ref_aside}>
        <aside className={style.aside}>
          <h2>Filters</h2>
          <form ref={ref_asideForm}>
            <input
              id="clear-filters-btn"
              type="button"
              value={"Clear Filters"}
              onClick={onClickClearButton}
            />
            <fieldset
              id="platform-fieldset"
              onChange={(evnt) => onFieldsetChange(evnt, "platform")}
            >
              <legend>Platform</legend>
              <ul>{createFilterOptions("platform")}</ul>
            </fieldset>
            <fieldset
              id="rating-fieldset"
              onChange={(evnt) => onFieldsetChange(evnt, "rating")}
            >
              <legend>Age Rating</legend>
              <ul>{createFilterOptions("rating")}</ul>
            </fieldset>

            <fieldset id="price-fieldset">
              <legend>Price</legend>
              <div>
                <input
                  type="number"
                  placeholder="Min"
                  min="0"
                  ref={ref_inputMinPrice}
                  defaultValue={selectedFilters.minPrice}
                />
                <input
                  type="number"
                  placeholder="Max"
                  min="0"
                  ref={ref_inputMaxPrice}
                  defaultValue={selectedFilters.maxPrice}
                />
              </div>
              <input
                id="form-submit-btn"
                type="submit"
                value="Set"
                onClick={onSubmitForm}
              />
            </fieldset>
          </form>
        </aside>
        <button
          id="mobile-filters-close"
          onClick={() => setMobileFilters(false)}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      <main className={style.main}>
        {!isNetworkError && <h2>{getMainHeader()}</h2>}
        <button id="mobile-filters-open" onClick={() => setMobileFilters(true)}>
          <span className="material-symbols-outlined">filter_list</span>
        </button>
        {getMain()}
      </main>
    </div>
  );
}

export default Search;
