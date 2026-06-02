import { useLayoutEffect } from "react";
import { Route, Routes, useLocation } from "react-router";
import "./App.css";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import Home from "./Pages/Home/Home";
import Search from "./Pages/Search/Search";
import ProductPage from "./Pages/Product/ProductPage";
import Cart from "./Pages/Cart/Cart";
import Debug from "./Pages/Debug/Debug";
import Error from "./Pages/Error/Error";

function App() {
  const location = useLocation();
  useLayoutEffect(() => {
    //Reset scroll to top of window
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/debug" element={<Debug />} />
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
