import { createServer, Response } from "miragejs";
import { productList } from "./utils/productList";
import { getFinalPrice } from "./utils/money";

const namespace = "/api";

let server;

// let time = 0; //By default 0 seconds
export function setTime(seconds) {
  if (!Number.isInteger(seconds)) return;
  if (seconds < 0) return;

  //Convert seconds to milliseconds
  server.timing = seconds * 1000;
}

let isNetworkActive = true;
export function setNetworkActive(isActive) {
  if (typeof isActive !== "boolean") return;

  isNetworkActive = isActive;
}

function serverInit() {
  server = createServer({
    timing: 0,
    routes() {
      // Return a game based on ID
      this.get(namespace + "/game/:id", (schema, request) => {
        if (!isNetworkActive) {
          return new Response(500);
        }

        let { id } = request.params;
        id = parseInt(id);
        if (Number.isNaN(id)) {
          return new Response(400, { error: ["ID is not an integer"] });
        }

        if (id < 0 || id >= productList.length) {
          return new Response(404, { errors: ["ID is invald"] });
        }

        return { product: productList[id] };
      });

      // Return all games
      this.get(namespace + "/game", () => {
        return { products: productList };
      });

      // Return all games based on a filter
      this.post(namespace + "/game", (schema, request) => {
        if (!isNetworkActive) {
          return new Response(500);
        }

        const { filters } = JSON.parse(request.requestBody);

        if (!filters) {
          return new Response(400, { errors: ["Filters not present"] });
        }

        // fltr_platform, fltr_rating arr[str]
        // fltr_minPrice, fltr_maxPrice int
        let {
          q: fltr_query,
          platform: fltr_platform,
          rating: fltr_rating,
          minPrice: fltr_minPrice,
          maxPrice: fltr_maxPrice,
        } = filters;

        if (fltr_minPrice < 0) fltr_minPrice = null;
        if (fltr_maxPrice < 0) fltr_maxPrice = null;

        let tmpArr = productList;

        // Search query
        if (fltr_query) {
          const queryWords = fltr_query.toLowerCase().split(" ");
          tmpArr = tmpArr.filter((product) => {
            for (const word of queryWords) {
              const title = product.title.toLowerCase();
              if (title.includes(word)) return true;
            }
            return false;
          });
        }

        //Platform
        if (fltr_platform && fltr_platform.length > 0) {
          tmpArr = tmpArr.filter((product) => {
            for (const platform of fltr_platform) {
              if (
                product.platform.find((element) => element.value === platform)
              ) {
                return true;
              }
            }
            return false;
          });
        }

        //Age Rating
        if (fltr_rating && fltr_rating.length > 0) {
          tmpArr = tmpArr.filter((product) => {
            for (const rating of fltr_rating) {
              return rating === product.esrb.rating.value;
            }
            return false;
          });
        }

        //Price
        if (!fltr_minPrice) {
          if (fltr_maxPrice) {
            tmpArr = tmpArr.filter(
              (product) =>
                getFinalPrice(product.price, product.sale) <= fltr_maxPrice,
            );
          }
        } else if (!fltr_maxPrice) {
          tmpArr = tmpArr.filter(
            (product) =>
              getFinalPrice(product.price, product.sale) >= fltr_minPrice,
          );
        } else {
          tmpArr = tmpArr.filter((product) => {
            const finalPrice = getFinalPrice(product.price, product.sale);
            return finalPrice >= fltr_minPrice && finalPrice <= fltr_maxPrice;
          });
        }

        return { products: tmpArr };
      });

      // Return all games with the given IDs array
      this.post(namespace + "/game/cart", (schema, request) => {
        if (!isNetworkActive) {
          return new Response(500);
        }

        const { cart } = JSON.parse(request.requestBody);
        if (!cart) {
          return new Response(400, { errors: ["No cart was passed"] });
        }
        if (!Array.isArray(cart)) {
          return new Response(400, {
            errors: ["Cart is invalid. Cart is not an array."],
          });
        }

        const tmpArr = cart.map((item) => productList[item.id]);

        return { products: tmpArr };
      });

      // Return all games with the given IDs array
      this.post(namespace + "/game/ids", (schema, request) => {
        if (!isNetworkActive) {
          return new Response(500);
        }

        const { ids } = JSON.parse(request.requestBody);
        if (!ids) {
          return new Response(400, { errors: ["No IDs were passed"] });
        }

        const tmpArr = ids.map((id) => productList[id]);

        return { products: tmpArr };
      });

      /*
      this.delete("/api/reminders/:id", (schema, request) => {
        let id = request.params.id;

        return schema.reminders.find(id).destroy();
      });

      this.get("/api/reminders", () => ({
        reminders: [
          { id: 1, text: "Walk the dog" },
          { id: 2, text: "Take out the trash" },
          { id: 3, text: "Work out" },
        ],
      }));

      let newId = 4;
      this.post("/api/reminders", (schema, request) => {
        let attrs = JSON.parse(request.requestBody);
        attrs.id = newId++;

        return { reminder: attrs };
      });
      */
    },
  });
}

export default serverInit;
