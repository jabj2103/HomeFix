import { useEffect, useState } from "react";
import {
  getAdminOrders,
  getAdminProducts,
  getAdminServiceRequests,
  updateOrderStatus,
  updateServiceRequestStatus,
} from "../services/adminService";
import { getOrderDetails } from "../services/orderService";
import "./AdminDashboard.css";

const orderStatuses = [
  "Pendiente",
  "Pagado",
  "En preparacion",
  "Enviado",
  "Entregado",
  "Cancelado",
];

const requestStatuses = [
  "Pendiente",
  "Confirmada",
  "En proceso",
  "Completada",
  "Cancelada",
];

const priceFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "medium",
});

function formatDate(value) {
  return value ? dateFormatter.format(new Date(value)) : "Sin fecha";
}

function getCategory(product) {
  return (
    product.category?.name ||
    product.categoryName ||
    product.category ||
    product.categoria ||
    "Sin categoria"
  );
}

function getErrorMessage(error, tableName) {
  const message = error?.message?.toLowerCase() || "";

  if (
    message.includes("not authorized") ||
    message.includes("permission") ||
    message.includes("unauthorized")
  ) {
    return `El label admin no tiene permisos suficientes en ${tableName}.`;
  }

  return `No se pudo cargar la informacion de ${tableName}.`;
}

function getStatusUpdateError(error, type) {
  const message = error?.message || "";
  const normalizedMessage = message.toLowerCase();
  const resourceName =
    type === "order" ? "el pedido" : "la solicitud de servicio";

  if (
    error?.code === 401 ||
    normalizedMessage.includes("not authorized") ||
    normalizedMessage.includes("permission") ||
    normalizedMessage.includes("unauthorized")
  ) {
    return `No tienes permiso para actualizar ${resourceName}. Verifica que el usuario conserve el label admin y vuelve a iniciar sesion.`;
  }

  if (
    error?.code === 400 ||
    normalizedMessage.includes("document structure") ||
    normalizedMessage.includes("attribute") ||
    normalizedMessage.includes("value")
  ) {
    return `Appwrite rechazo el valor de status: ${message}`;
  }

  return message
    ? `No se pudo actualizar ${resourceName}: ${message}`
    : `No se pudo actualizar ${resourceName}.`;
}

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [updatingId, setUpdatingId] = useState("");
  const [updateError, setUpdateError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      const [ordersResult, requestsResult, productsResult] =
        await Promise.allSettled([
          getAdminOrders(),
          getAdminServiceRequests(),
          getAdminProducts(),
        ]);

      if (!isMounted) return;

      if (ordersResult.status === "fulfilled") {
        setOrders(ordersResult.value);
      } else {
        console.error("Error cargando orders:", ordersResult.reason);
        setErrors((current) => ({
          ...current,
          orders: getErrorMessage(ordersResult.reason, "orders"),
        }));
      }

      if (requestsResult.status === "fulfilled") {
        setRequests(requestsResult.value);
      } else {
        console.error(
          "Error cargando service_requests:",
          requestsResult.reason,
        );
        setErrors((current) => ({
          ...current,
          requests: getErrorMessage(
            requestsResult.reason,
            "service_requests",
          ),
        }));
      }

      if (productsResult.status === "fulfilled") {
        setProducts(productsResult.value);
      } else {
        console.error("Error cargando products:", productsResult.reason);
        setErrors((current) => ({
          ...current,
          products: getErrorMessage(productsResult.reason, "products"),
        }));
      }

      setLoading(false);
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleStatusChange(type, rowId, status) {
    try {
      setUpdatingId(rowId);
      setUpdateError("");

      if (type === "order") {
        const updatedOrder = await updateOrderStatus(rowId, status);
        setOrders((current) =>
          current.map((order) =>
            order.$id === rowId ? updatedOrder : order,
          ),
        );
      } else {
        const updatedRequest = await updateServiceRequestStatus(rowId, status);
        setRequests((current) =>
          current.map((request) =>
            request.$id === rowId ? updatedRequest : request,
          ),
        );
      }
    } catch (error) {
      console.error("No se pudo actualizar el estado:", error);
      setUpdateError(getStatusUpdateError(error, type));
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p>Administracion HomeFix</p>
          <h1>Panel de operaciones</h1>
          <span>Gestiona pedidos, solicitudes y consulta el catalogo.</span>
        </div>
        <div className="admin-summary" aria-label="Resumen administrativo">
          <div>
            <strong>{orders.length}</strong>
            <span>Pedidos</span>
          </div>
          <div>
            <strong>{requests.length}</strong>
            <span>Solicitudes</span>
          </div>
          <div>
            <strong>{products.length}</strong>
            <span>Productos</span>
          </div>
        </div>
      </header>

      <nav className="admin-tabs" aria-label="Secciones administrativas">
        <button
          type="button"
          className={activeSection === "orders" ? "active" : ""}
          onClick={() => setActiveSection("orders")}
        >
          Pedidos
        </button>
        <button
          type="button"
          className={activeSection === "requests" ? "active" : ""}
          onClick={() => setActiveSection("requests")}
        >
          Solicitudes
        </button>
        <button
          type="button"
          className={activeSection === "products" ? "active" : ""}
          onClick={() => setActiveSection("products")}
        >
          Productos
        </button>
      </nav>

      {loading && <p className="admin-state">Cargando panel...</p>}
      {updateError && <p className="admin-alert">{updateError}</p>}

      {!loading && activeSection === "orders" && (
        <section className="admin-section" aria-labelledby="admin-orders-title">
          <div className="admin-section-heading">
            <div>
              <h2 id="admin-orders-title">Pedidos registrados</h2>
              <p>Consulta la compra y actualiza su estado operativo.</p>
            </div>
            <span>{orders.length} registros</span>
          </div>

          {errors.orders ? (
            <p className="admin-state admin-state-error">{errors.orders}</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Pedido</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Entrega</th>
                    <th>Pago</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const delivery = getOrderDetails(order).delivery;

                    return (
                      <tr key={order.$id}>
                        <td>#{order.$id.slice(-8).toUpperCase()}</td>
                        <td>{formatDate(order.$createdAt)}</td>
                        <td>{priceFormatter.format(Number(order.total) || 0)}</td>
                        <td>
                          {delivery
                            ? [delivery.address, delivery.city]
                                .filter(Boolean)
                                .join(", ")
                            : "Sin direccion registrada"}
                          {delivery?.phone && <small>{delivery.phone}</small>}
                        </td>
                        <td>{order.paymentMethod || "Sin definir"}</td>
                        <td>
                          <select
                            value={order.status}
                            disabled={updatingId === order.$id}
                            onChange={(event) =>
                              handleStatusChange(
                                "order",
                                order.$id,
                                event.target.value,
                              )
                            }
                            aria-label={`Estado del pedido ${order.$id}`}
                          >
                            {orderStatuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {orders.length === 0 && (
                <p className="admin-empty">No hay pedidos registrados.</p>
              )}
            </div>
          )}
        </section>
      )}

      {!loading && activeSection === "requests" && (
        <section
          className="admin-section"
          aria-labelledby="admin-requests-title"
        >
          <div className="admin-section-heading">
            <div>
              <h2 id="admin-requests-title">Solicitudes registradas</h2>
              <p>Organiza la atencion de los servicios solicitados.</p>
            </div>
            <span>{requests.length} registros</span>
          </div>

          {errors.requests ? (
            <p className="admin-state admin-state-error">{errors.requests}</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Servicio</th>
                    <th>Fecha preferida</th>
                    <th>Urgencia</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.$id}>
                      <td>
                        <strong>{request.customerName}</strong>
                        <small>{request.email}</small>
                      </td>
                      <td>{request.serviceType}</td>
                      <td>
                        {formatDate(request.preferredDate)}
                        <small>{request.timeSlot}</small>
                      </td>
                      <td>{request.urgency || "Sin definir"}</td>
                      <td>
                        <select
                          value={request.status}
                          disabled={updatingId === request.$id}
                          onChange={(event) =>
                            handleStatusChange(
                              "request",
                              request.$id,
                              event.target.value,
                            )
                          }
                          aria-label={`Estado de la solicitud ${request.$id}`}
                        >
                          {requestStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {requests.length === 0 && (
                <p className="admin-empty">No hay solicitudes registradas.</p>
              )}
            </div>
          )}
        </section>
      )}

      {!loading && activeSection === "products" && (
        <section className="admin-section" aria-labelledby="admin-products-title">
          <div className="admin-section-heading">
            <div>
              <h2 id="admin-products-title">Productos registrados</h2>
              <p>Vista general del catalogo disponible en HomeFix.</p>
            </div>
            <span>{products.length} registros</span>
          </div>

          {errors.products ? (
            <p className="admin-state admin-state-error">{errors.products}</p>
          ) : (
            <div className="admin-products">
              {products.map((product) => (
                <article key={product.$id}>
                  <div className="admin-product-media">
                    {product.imageSrc ? (
                      <img src={product.imageSrc} alt={product.name} />
                    ) : (
                      <span aria-hidden="true" />
                    )}
                  </div>
                  <div>
                    <small>{getCategory(product)}</small>
                    <h3>{product.name}</h3>
                    <strong>
                      {priceFormatter.format(Number(product.price) || 0)}
                    </strong>
                  </div>
                </article>
              ))}
              {products.length === 0 && (
                <p className="admin-empty">No hay productos registrados.</p>
              )}
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default AdminDashboard;
