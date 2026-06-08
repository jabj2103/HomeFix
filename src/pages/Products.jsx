import { useEffect, useState } from "react";
import { addToCart } from "../services/cartService";
import { getProducts } from "../services/productService";
import "./Products.css";

const priceFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

function getCategory(product) {
  return (
    product.category?.name ||
    product.categoryName ||
    product.category_name ||
    product.category ||
    product.categoria?.name ||
    product.categoriaNombre ||
    product.categoria ||
    "Categoria no definida"
  );
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedProductId, setAddedProductId] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error(error);
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  function handleAddToCart(product) {
    addToCart(product);
    setAddedProductId(product.$id);

    window.setTimeout(() => {
      setAddedProductId("");
    }, 1200);
  }

  return (
    <main className="products-page">
      <header className="products-header">
        <h1>Productos HomeFix</h1>
      </header>

      {loading && <p className="products-status">Cargando productos...</p>}
      {error && <p className="products-status products-status-error">{error}</p>}

      {!loading && !error && (
        <section className="products-grid" aria-label="Lista de productos">
          {products.map((product) => (
            <article className="product-card" key={product.$id}>
              <div className="product-card-media">
                {product.imageSrc ? (
                  <img
                    src={product.imageSrc}
                    alt={product.name}
                    loading="lazy"
                  />
                ) : (
                  <div className="product-card-image-empty" aria-hidden="true" />
                )}
              </div>

              <div className="product-card-body">
                <p className="product-card-category">{getCategory(product)}</p>
                <h2>{product.name}</h2>
                <p className="product-card-price">
                  {priceFormatter.format(product.price)}
                </p>
                <button
                  className="product-card-button"
                  type="button"
                  onClick={() => handleAddToCart(product)}
                >
                  {addedProductId === product.$id
                    ? "Agregado"
                    : "Agregar al carrito"}
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
