import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import {
  getUserOrders,
  getUserServiceRequests,
} from "../services/profileService";
import { getOrderDetails } from "../services/orderService";
import "./Profile.css";

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const formatDate = (value) => {
  if (!value) return "Fecha no disponible";

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
  }).format(new Date(value));
};

const getActivityErrorMessage = (error, activityName) => {
  const message = error?.message?.toLowerCase() || "";

  if (message.includes("index")) {
    return `Falta un indice para userId en la tabla ${activityName}.`;
  }

  if (
    message.includes("not authorized") ||
    message.includes("unauthorized") ||
    message.includes("permission")
  ) {
    return `Tu usuario no tiene permiso de lectura en la tabla ${activityName}.`;
  }

  if (
    message.includes("attribute") ||
    message.includes("column") ||
    message.includes("userid")
  ) {
    return `La tabla ${activityName} no tiene una columna userId valida.`;
  }

  return `No pudimos cargar la informacion de ${activityName}.`;
};

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [requestsError, setRequestsError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        navigate("/login", {
          replace: true,
          state: { from: "/profile" },
        });
        return;
      }

      if (!isMounted) return;
      setUser(currentUser);

      try {
        const [ordersResult, requestsResult] = await Promise.allSettled([
          getUserOrders(currentUser.$id),
          getUserServiceRequests(currentUser.$id),
        ]);

        if (!isMounted) return;

        if (ordersResult.status === "fulfilled") {
          setOrders(ordersResult.value);
        } else {
          console.error("No se pudieron cargar los pedidos:", ordersResult.reason);
          setOrdersError(
            getActivityErrorMessage(ordersResult.reason, "orders"),
          );
        }

        if (requestsResult.status === "fulfilled") {
          setRequests(requestsResult.value);
        } else {
          console.error(
            "No se pudieron cargar las solicitudes:",
            requestsResult.reason,
          );
          setRequestsError(
            getActivityErrorMessage(
              requestsResult.reason,
              "service_requests",
            ),
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  if (!user && loading) {
    return <main className="profile-page profile-loading">Cargando perfil...</main>;
  }

  return (
    <main className="profile-page">
      <section className="profile-hero">
        <div className="profile-avatar" aria-hidden="true">
          {(user?.name || user?.email || "H").charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="profile-eyebrow">Mi cuenta</p>
          <h1>{user?.name || "Usuario HomeFix"}</h1>
          <p>{user?.email}</p>
        </div>
      </section>

      <section className="profile-content">
        <div className="profile-tabs" role="tablist" aria-label="Actividad">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "orders"}
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            Mis pedidos <span>{orders.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "requests"}
            className={activeTab === "requests" ? "active" : ""}
            onClick={() => setActiveTab("requests")}
          >
            Mis solicitudes <span>{requests.length}</span>
          </button>
        </div>

        {loading && <p className="profile-state">Cargando tu actividad...</p>}
        {!loading && activeTab === "orders" && ordersError && (
          <p className="profile-state profile-error">{ordersError}</p>
        )}
        {!loading && activeTab === "requests" && requestsError && (
          <p className="profile-state profile-error">{requestsError}</p>
        )}

        {!loading && !ordersError && activeTab === "orders" && (
          <div className="profile-list">
            {orders.length === 0 ? (
              <div className="profile-empty">
                <h2>Aun no tienes pedidos</h2>
                <p>Los pedidos que realices apareceran en esta seccion.</p>
              </div>
            ) : (
              orders.map((order) => {
                const delivery = getOrderDetails(order).delivery;

                return (
                  <article className="profile-item" key={order.$id}>
                    <div>
                      <p className="profile-item-label">Pedido</p>
                      <h2>#{order.$id.slice(-8).toUpperCase()}</h2>
                      <p>{formatDate(order.$createdAt)}</p>
                      {delivery && (
                        <p>
                          Entrega: {delivery.address}, {delivery.city}
                        </p>
                      )}
                    </div>
                    <div className="profile-item-details">
                      <span className="profile-status">{order.status}</span>
                      <strong>{formatCurrency(order.total)}</strong>
                      <small>
                        {order.paymentMethod || "Metodo por confirmar"}
                      </small>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        )}

        {!loading && !requestsError && activeTab === "requests" && (
          <div className="profile-list">
            {requests.length === 0 ? (
              <div className="profile-empty">
                <h2>Aun no tienes solicitudes</h2>
                <p>Tus solicitudes de servicio apareceran en esta seccion.</p>
              </div>
            ) : (
              requests.map((request) => (
                <article className="profile-item" key={request.$id}>
                  <div>
                    <p className="profile-item-label">Servicio solicitado</p>
                    <h2>{request.serviceType}</h2>
                    <p>
                      {formatDate(request.preferredDate)}
                      {request.timeSlot ? ` · ${request.timeSlot}` : ""}
                    </p>
                  </div>
                  <div className="profile-item-details">
                    <span className="profile-status">{request.status}</span>
                    {request.urgency && <strong>{request.urgency}</strong>}
                    <small>{request.address}</small>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default Profile;
