import { React, useRef, useState } from "react";
import styles from "./Header.module.css";
import { Link, useNavigate } from "react-router";
import { getCart } from "../../utils/cart";
import DebugMenu from "../Debug/DebugMenu";

function Header() {
  const navigate = useNavigate();

  const ref_dialog = useRef(null);

  function onFormSubmit(evnt) {
    evnt.preventDefault();
    // setSearchText(evnt.target.children[0].value);
    navigate("search?q=" + evnt.target.children[0].value);
  }

  function getCartLength() {
    const cartLength = getCart().length;
    if (cartLength > 10) {
      return "+";
    } else if (cartLength > 0) {
      return cartLength.toString();
    } else {
      return "";
    }
  }

  //#region Mobile Menu

  function openMobileMenu() {
    ref_dialog.current.showModal();
  }

  function closeMobileMenu() {
    ref_dialog.current.close();
  }
  //#endregion

  return (
    <div className={styles.my_header} id="my-header">
      <header>
        <button
          className={`${styles.mobile_menu_open} material-symbols-outlined`}
          onClick={openMobileMenu}
        >
          menu
        </button>
        <Link to={"/"}>
          <img src="store_icon.svg" alt="GameStore logo" />
        </Link>
        <form id="search" className={styles.search} onSubmit={onFormSubmit}>
          <input type="text" placeholder="Search" />
          <input
            type="submit"
            className="material-symbols-outlined"
            value="search"
          />
        </form>
        <div className={styles.header_col_3}>
          <Link to={"/account"} aria-label="Account">
            <div className="material-symbols-outlined">account_circle</div>
          </Link>
          <Link to={"/cart"} className={styles.cart} id="cart">
            <div className="material-symbols-outlined">shopping_cart</div>
            <p>{getCartLength()}</p>
          </Link>
          <DebugMenu />
        </div>
      </header>
      <nav>
        <ul>
          <li>
            <Link to={"/search?platform=ps5&platform=ps4"}>Playstation</Link>
          </li>
          <li>
            <Link to={"/search?platform=ns"}>Switch</Link>
          </li>
          <li>
            <Link to={"/search?platform=xbox"}>XBOX</Link>
          </li>
          <li>
            <Link to={"/search?platform=pc"}>PC</Link>
          </li>
        </ul>
      </nav>
      <dialog closedby="any" className={styles.mobile_dialog} ref={ref_dialog}>
        <div className={styles.mobile_nav_wrapper}>
          <button
            className={styles.mobile_menu_close}
            aria-label="Close Menu"
            onClick={closeMobileMenu}
          >
            <span className="material-symbols-outlined"> close </span>
          </button>
          <div className={styles.nav_dialog_pg}>
            <section>
              <h2>Menu</h2>
              <ul>
                <li>
                  <Link to={"/account"}>Account </Link>
                </li>
                <li>
                  <Link to={"/logout"}>Logout </Link>
                </li>
                <li>
                  <Link to={"/cart"}>Cart </Link>
                </li>
              </ul>
            </section>
            <section>
              <h2>Shop By Platform</h2>
              <ul>
                <li>
                  <Link to={"/search?platform=ps5&platform=ps4"}>
                    Playstation
                  </Link>
                </li>
                <li>
                  <Link to={"/search?platform=ns"}>Switch</Link>
                </li>
                <li>
                  <Link to={"/search?platform=xbox"}>XBOX</Link>
                </li>
                <li>
                  <Link to={"/search?platform=pc"}>PC</Link>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default Header;
