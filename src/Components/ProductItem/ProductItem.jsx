import React from "react";
import "./ProductItem.css";
import { Link } from "react-router";
import {
  formatPrice,
  getFinalPrice,
  saleToPercentage,
} from "../../utils/money";
import { isProductReleased } from "../../utils/dates";

function ProductItem(props) {
  const {
    productID: id,
    title,
    price,
    sale,
    releaseDate: release,
    image,
  } = props;

  const finalPrice = formatPrice(getFinalPrice(price, sale));
  const onPreOrder = !isProductReleased(release);

  let imagePath = "";
  if (image) {
    imagePath = `product/${image.path}/${image.main}`;
  }

  return (
    <li className="product-listing">
      <Link to={"/product/" + id}>
        <img src={imagePath} alt="" />
        <div className="product-info">
          <p className="title">{title}</p>
          <p className="price">{finalPrice}</p>
          {sale > 0 && (
            <div className="sale">
              <p>{saleToPercentage(sale)}</p>
              <p>{formatPrice(price)}</p>
            </div>
          )}
          {onPreOrder && <p className="pre-order">Pre Order Now</p>}
        </div>
      </Link>
    </li>
  );
}

export default ProductItem;
