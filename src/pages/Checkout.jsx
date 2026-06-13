import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getCurrentUser } from "../services/authService";
import { getCartItems } from "../services/cartService";
import { createOrder } from "../services/orderService";
import { getPayuPaymentData } from "../services/payuService";
import "./Checkout.css";

const priceFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

function Checkout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [orderCreated, setOrderCreated] = useState(null);
  const [payuPaymentData, setPayuPaymentData] = useState(null);
  const [delivery, setDelivery] = useState({
    phone: "",
    city: "",
    address: "",
    details: "",
  });

  useEffect(() => {
    async function prepareCheckout() {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        navigate("/login", {
          replace: true,
          state: { from: "/checkout" },
        });
        return;
      }

      setUser(currentUser);
      setItems(getCartItems());
      setLoading(false);
    }

    prepareCheckout();
  }, [navigate]);

  const total = useMemo(
    () =>
      items.reduce(
        (subtotal, item) => subtotal + item.price * item.quantity,
        0
      ),
    [items]
  );

  function handleDeliveryChange(event) {
    const { name, value } = event.target;

    setDelivery((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleWompiPayment(event) {
    event.preventDefault();

    if (!user || items.length === 0) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const order = await createOrder({ user, items, total, delivery });
      setOrderCreated(order);
      setPayuPaymentData(getPayuPaymentData({ order, user, total }));
    } catch (error) {
      console.error(error);
      const message = error.message || "";

      setError(
        message.includes("not authorized") ||
          message.includes("No permissions provided for action 'create'")
          ? "La tabla de ordenes no permite crear registros para este usuario."
          : message.includes("Invalid document structure")
            ? message
          : "No se pudo preparar el pago."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="checkout-page">
        <p className="checkout-status">Preparando checkout...</p>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <header className="checkout-header">
        <div>
          <h1>Checkout</h1>
          <p>Confirma tu compra antes de continuar con PayU Sandbox.</p>
        </div>
        <Link className="checkout-back-link" to="/cart">
          Volver al carrito
        </Link>
      </header>

      {items.length === 0 ? (
        <section className="checkout-empty">
          <h2>No hay productos para pagar</h2>
          <p>Agrega productos al carrito para continuar.</p>
          <Link to="/products">Ver productos</Link>
        </section>
      ) : (
        <section className="checkout-layout">
          <div className="checkout-items">
            {items.map((item) => {
              const subtotal = item.price * item.quantity;

              return (
                <article className="checkout-item" key={item.id}>
                  <div className="checkout-item-media">
                    {item.imageSrc ? (
                      <img src={item.imageSrc} alt={item.name} />
                    ) : (
                      <div className="checkout-item-image-empty" aria-hidden="true" />
                    )}
                  </div>
                  <div>
                    <h2>{item.name}</h2>
                    <p>
                      {item.quantity} x {priceFormatter.format(item.price)}
                    </p>
                  </div>
                  <strong>{priceFormatter.format(subtotal)}</strong>
                </article>
              );
            })}

            <form
              className="checkout-delivery"
              id="checkout-delivery-form"
              onSubmit={handleWompiPayment}
            >
              <div className="checkout-delivery-heading">
                <div>
                  <h2>Datos de entrega</h2>
                  <p>Indica dónde debemos entregar tu pedido.</p>
                </div>
                <span>Obligatorio</span>
              </div>

              <div className="checkout-delivery-grid">
                <label>
                  Teléfono de contacto
                  <input
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={delivery.phone}
                    onChange={handleDeliveryChange}
                    minLength="7"
                    maxLength="20"
                    disabled={Boolean(orderCreated)}
                    required
                  />
                </label>

                <label>
                  Ciudad o municipio
                  <input
                    name="city"
                    autoComplete="address-level2"
                    value={delivery.city}
                    onChange={handleDeliveryChange}
                    maxLength="100"
                    disabled={Boolean(orderCreated)}
                    required
                  />
                </label>

                <label className="checkout-delivery-full">
                  Dirección
                  <input
                    name="address"
                    autoComplete="street-address"
                    placeholder="Ej. Calle 80 # 20-15"
                    value={delivery.address}
                    onChange={handleDeliveryChange}
                    maxLength="180"
                    disabled={Boolean(orderCreated)}
                    required
                  />
                </label>

                <label className="checkout-delivery-full">
                  Indicaciones adicionales
                  <textarea
                    name="details"
                    placeholder="Apartamento, torre, barrio o referencia"
                    value={delivery.details}
                    onChange={handleDeliveryChange}
                    maxLength="300"
                    disabled={Boolean(orderCreated)}
                    rows="3"
                  />
                </label>
              </div>
            </form>
          </div>

          <aside className="checkout-summary">
            <h2>Resumen de pago</h2>
            <div className="checkout-summary-row">
              <span>Cliente</span>
              <span>{user.name || user.email}</span>
            </div>
            <div className="checkout-summary-row">
              <span>Productos</span>
              <span>{items.reduce((count, item) => count + item.quantity, 0)}</span>
            </div>
            <div className="checkout-summary-row">
              <span>Metodo</span>
              <span>PayU Sandbox</span>
            </div>
            <div className="checkout-summary-row checkout-summary-total">
              <span>Total</span>
              <strong>{priceFormatter.format(total)}</strong>
            </div>

            {error && <p className="checkout-error">{error}</p>}
            {orderCreated && (
              <p className="checkout-success">
                Orden creada. Puedes continuar al entorno seguro de PayU.
              </p>
            )}

            {payuPaymentData ? (
              <form
                action={payuPaymentData.action}
                className="checkout-payu-form"
                method="post"
              >
                {Object.entries(payuPaymentData.fields).map(([name, value]) => (
                  <input key={name} name={name} type="hidden" value={value} />
                ))}
                <button className="checkout-pay-button" type="submit">
                  Ir a PayU Sandbox
                </button>
              </form>
            ) : (
              <button
                className="checkout-pay-button"
                type="submit"
                form="checkout-delivery-form"
                disabled={submitting}
              >
                {submitting ? "Creando orden..." : "Pagar con PayU Sandbox"}
              </button>
            )}

            <div className="checkout-test-cards">
              <h3>Tarjetas de prueba Colombia</h3>
              <p>Visa: 4111111111111111</p>
              <p>Mastercard: 5471300000000003</p>
              <p>Para aprobar: titular APPROVED, CVV 777.</p>
            </div>
          </aside>
        </section>
      )}
    </main>
  );
}

export default Checkout;
