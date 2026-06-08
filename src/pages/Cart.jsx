import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  getCartItems,
  removeCartItem,
  subscribeToCartUpdates,
  updateCartItemQuantity,
} from "../services/cartService";
import "./Cart.css";

const priceFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

function Cart() {
  const [items, setItems] = useState(() => getCartItems());

  useEffect(() => {
    function refreshCart() {
      setItems(getCartItems());
    }

    return subscribeToCartUpdates(refreshCart);
  }, []);

  const total = useMemo(
    () =>
      items.reduce(
        (subtotal, item) => subtotal + item.price * item.quantity,
        0
      ),
    [items]
  );

  function handleQuantityChange(productId, quantity) {
    setItems(updateCartItemQuantity(productId, quantity));
  }

  function handleRemove(productId) {
    setItems(removeCartItem(productId));
  }

  return (
    <main className="cart-page">
      <header className="cart-header">
        <div>
          <h1>Carrito de compras</h1>
          <p>Revisa tus productos antes de finalizar la compra.</p>
        </div>
        <Link className="cart-continue-link" to="/products">
          Seguir comprando
        </Link>
      </header>

      {items.length === 0 ? (
        <section className="cart-empty">
          <h2>Tu carrito esta vacio</h2>
          <p>Agrega productos de HomeFix para verlos aqui.</p>
          <Link to="/products">Ver productos</Link>
        </section>
      ) : (
        <section className="cart-layout">
          <div className="cart-items" aria-label="Productos en el carrito">
            {items.map((item) => {
              const subtotal = item.price * item.quantity;

              return (
                <article className="cart-item" key={item.id}>
                  <div className="cart-item-media">
                    {item.imageSrc ? (
                      <img src={item.imageSrc} alt={item.name} />
                    ) : (
                      <div className="cart-item-image-empty" aria-hidden="true" />
                    )}
                  </div>

                  <div className="cart-item-info">
                    <p className="cart-item-category">{item.category}</p>
                    <h2>{item.name}</h2>
                    <p className="cart-item-price">
                      {priceFormatter.format(item.price)}
                    </p>
                  </div>

                  <div className="cart-item-controls">
                    <div
                      className="cart-quantity-control"
                      aria-label={`Cantidad de ${item.name}`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        aria-label="Disminuir cantidad"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>

                    <p className="cart-item-subtotal">
                      {priceFormatter.format(subtotal)}
                    </p>
                    <button
                      className="cart-remove-button"
                      type="button"
                      onClick={() => handleRemove(item.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="cart-summary" aria-label="Resumen de compra">
            <h2>Resumen</h2>
            <div className="cart-summary-row">
              <span>Productos</span>
              <span>{items.reduce((count, item) => count + item.quantity, 0)}</span>
            </div>
            <div className="cart-summary-row cart-summary-total">
              <span>Total</span>
              <strong>{priceFormatter.format(total)}</strong>
            </div>
            <Link className="cart-checkout-button" to="/checkout">
              Finalizar compra
            </Link>
          </aside>
        </section>
      )}
    </main>
  );
}

export default Cart;
