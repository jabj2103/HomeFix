import { Link, useSearchParams } from "react-router-dom";
import "./PaymentResult.css";

function getTransactionLabel(state) {
  const states = {
    "4": "Transaccion aprobada",
    "5": "Transaccion expirada",
    "6": "Transaccion rechazada",
    "7": "Transaccion pendiente",
  };

  return states[state] || "Resultado de la transaccion";
}

function PaymentResult() {
  const [searchParams] = useSearchParams();
  const transactionState = searchParams.get("transactionState");
  const referenceCode = searchParams.get("referenceCode");
  const message = searchParams.get("message");
  const value = searchParams.get("TX_VALUE");
  const currency = searchParams.get("currency");
  const paymentMethod = searchParams.get("lapPaymentMethod");

  return (
    <main className="payment-result-page">
      <section className="payment-result-card">
        <p>PayU Sandbox</p>
        <h1>{getTransactionLabel(transactionState)}</h1>
        <dl>
          <div>
            <dt>Referencia</dt>
            <dd>{referenceCode || "No disponible"}</dd>
          </div>
          <div>
            <dt>Valor</dt>
            <dd>{value ? `${value} ${currency || "COP"}` : "No disponible"}</dd>
          </div>
          <div>
            <dt>Metodo</dt>
            <dd>{paymentMethod || "No disponible"}</dd>
          </div>
          <div>
            <dt>Mensaje</dt>
            <dd>{message || "PayU no envio un mensaje adicional."}</dd>
          </div>
        </dl>
        <Link to="/products">Volver a productos</Link>
      </section>
    </main>
  );
}

export default PaymentResult;
