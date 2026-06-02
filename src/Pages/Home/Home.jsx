import { React, useState, useRef, useEffect } from "react";
import styles from "./Home.module.css";
import ProductItem from "../../Components/ProductItem/ProductItem";
import { Link } from "react-router";
import Carousel from "../../Components/Home_Carousel/Carousel";
import TryAgain from "../../Components/TryAgain/TryAgain";

function Home() {
  const STATE = { LOADING: 0, HAPPY_PATH: 1, NETWORK_ERROR: 2 };
  const [staffPicks, setStaffPicks] = useState([]);
  const [st_staffPicks, setSt_staffPicks] = useState(STATE.LOADING);

  useEffect(() => {
    wrapper();

    async function wrapper() {
      await fetchStaffPicks();
    }
  }, []);

  //#region Staff Picks
  const staffPickIDs = [1, 8, 2, 4];
  async function fetchStaffPicks() {
    try {
      await fetch("/api/game/ids", {
        method: "POST",
        body: JSON.stringify({
          ids: staffPickIDs,
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
          setStaffPicks(json.products);
          setSt_staffPicks(STATE.HAPPY_PATH);
        });
    } catch ({ name, message, cause }) {
      if (message === "500") {
        setSt_staffPicks(STATE.NETWORK_ERROR);
        return;
      } else if (message === "400") {
        console.error(name, message, cause);
      }
    }
  }

  //#endregion

  return (
    <main className={styles.pg_home}>
      <title>GameStore</title>
      <Carousel />
      <h2>Staff Picks</h2>
      {st_staffPicks === STATE.LOADING && (
        <ul className={styles.staff_picks}>
          <li className="skeleton"></li>
          <li className="skeleton"></li>
          <li className="skeleton"></li>
          <li className="skeleton"></li>
        </ul>
      )}
      {st_staffPicks === STATE.NETWORK_ERROR && (
        <TryAgain tryAgain={fetchStaffPicks} />
      )}
      {st_staffPicks === STATE.HAPPY_PATH && (
        <ul className={styles.staff_picks}>
          {staffPicks.map((product) => (
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
      )}
      <h2>Shop by Category</h2>
      <ul className={styles.shop_by_category}>
        <li>
          <Link to="/search">
            <div>
              <p>Video Games</p>
            </div>
            <img src="home_page/categories/image2.webp" />
          </Link>
        </li>
        <li>
          <Link to="/">
            <div>
              <p>Consoles</p>
              <p>Coming Soon</p>
            </div>
            <img src="home_page/categories/image1.webp" />
          </Link>
        </li>
        <li>
          <Link to="/">
            <div>
              <p>Figurines</p>
              <p>Coming Soon</p>
            </div>
            <img src="home_page/categories/image3.webp" />
          </Link>
        </li>
        <li>
          <Link to="/">
            <div>
              <p>Books</p>
              <p>Coming Soon</p>
            </div>
            <img src="home_page/categories/image0.webp" />
          </Link>
        </li>
      </ul>
    </main>
  );
}

export default Home;
