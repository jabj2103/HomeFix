import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createServiceRequest,
  getServices,
} from "../services/serviceService";
import { getCurrentUser } from "../services/authService";
import "./Services.css";

const priceFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const timeSlots = [
  "Manana: 8:00 a. m. - 12:00 p. m.",
  "Tarde: 12:00 p. m. - 5:00 p. m.",
  "Noche: 5:00 p. m. - 8:00 p. m.",
];

const urgencyLevels = [
  "Baja",
  "Media",
  "Alta",
  "Emergencia",
];

function getTodayInputValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getServicePrice(service) {
  return (
    service.basePrice ||
    service.base_price ||
    service.precioBase ||
    service.precio_base ||
    service.price ||
    service.precio ||
    0
  );
}

function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [requestStatus, setRequestStatus] = useState("");
  const [requestError, setRequestError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [requestUser, setRequestUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    preferredDate: "",
    timeSlot: "",
    urgency: "",
    problemDescription: "",
  });

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error(error);
        setError(
          error.message?.includes("not authorized")
            ? "La tabla de servicios no tiene permisos de lectura publica."
            : "No se pudieron cargar los servicios."
        );
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  async function openRequestForm(service) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      navigate("/login", {
        state: { from: "/services" },
      });
      return;
    }

    setRequestUser(currentUser);
    setFormData((currentData) => ({
      ...currentData,
      fullName: currentData.fullName || currentUser.name || "",
      email: currentData.email || currentUser.email || "",
    }));
    setSelectedService(service);
    setRequestStatus("");
    setRequestError("");
  }

  function closeRequestForm() {
    setSelectedService(null);
    setRequestUser(null);
    setRequestError("");
    setSubmitting(false);
  }

  function handleFormChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleRequestSubmit(event) {
    event.preventDefault();

    if (!selectedService) {
      return;
    }

    try {
      setSubmitting(true);
      setRequestError("");
      const currentUser = requestUser || (await getCurrentUser());

      if (!currentUser) {
        closeRequestForm();
        navigate("/login", {
          state: { from: "/services" },
        });
        return;
      }

      await createServiceRequest(selectedService, formData, currentUser);
      setRequestStatus("Tu solicitud fue enviada correctamente.");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        preferredDate: "",
        timeSlot: "",
        urgency: "",
        problemDescription: "",
      });
      setSelectedService(null);
      setRequestUser(null);
    } catch (error) {
      console.error(error);
      const message = error.message || "";

      setRequestError(
        message.includes("not authorized") ||
          message.includes("No permissions provided for action 'create'")
          ? "La tabla service_requests no permite crear solicitudes publicas."
          : "No se pudo enviar la solicitud."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="services-page">
      <header className="services-header">
        <h1>Servicios HomeFix</h1>
      </header>

      {loading && <p className="services-status">Cargando servicios...</p>}
      {error && <p className="services-status services-status-error">{error}</p>}
      {requestStatus && (
        <p className="services-confirmation">{requestStatus}</p>
      )}

      {!loading && !error && (
        <section className="services-grid" aria-label="Lista de servicios">
          {services.map((service) => (
            <article className="service-card" key={service.$id}>
              <div className="service-card-media">
                {service.imageSrc ? (
                  <img
                    src={service.imageSrc}
                    alt={service.name}
                    loading="lazy"
                  />
                ) : (
                  <div className="service-card-image-empty" aria-hidden="true" />
                )}
              </div>

              <div className="service-card-body">
                <h2>{service.name}</h2>
                <p className="service-card-description">
                  {service.description}
                </p>
                <p className="service-card-price">
                  Desde {priceFormatter.format(getServicePrice(service))}
                </p>
                <button
                  className="service-card-button"
                  type="button"
                  onClick={() => openRequestForm(service)}
                >
                  Solicitar servicio
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {selectedService && (
        <div className="service-modal-backdrop" role="presentation">
          <section
            className="service-request-modal"
            aria-labelledby="service-request-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="service-request-header">
              <div>
                <p>Solicitud de servicio</p>
                <h2 id="service-request-title">{selectedService.name}</h2>
              </div>
              <button
                className="service-modal-close"
                type="button"
                onClick={closeRequestForm}
                aria-label="Cerrar formulario"
              >
                X
              </button>
            </div>

            <form className="service-request-form" onSubmit={handleRequestSubmit}>
              <label>
                Nombre completo
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFormChange}
                  required
                />
              </label>

              <label>
                Correo
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
              </label>

              <label>
                Telefono
                <input
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                />
              </label>

              <label>
                Direccion
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  required
                />
              </label>

              <label>
                Fecha preferida
                <input
                  name="preferredDate"
                  type="date"
                  min={getTodayInputValue()}
                  value={formData.preferredDate}
                  onChange={handleFormChange}
                  required
                />
              </label>

              <label>
                Franja horaria
                <select
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Selecciona una franja</option>
                  {timeSlots.map((timeSlot) => (
                    <option key={timeSlot} value={timeSlot}>
                      {timeSlot}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Urgencia
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Selecciona la urgencia</option>
                  {urgencyLevels.map((urgency) => (
                    <option key={urgency} value={urgency}>
                      {urgency}
                    </option>
                  ))}
                </select>
              </label>

              <label className="service-request-field-full">
                Descripcion del problema
                <textarea
                  name="problemDescription"
                  value={formData.problemDescription}
                  onChange={handleFormChange}
                  rows="5"
                  required
                />
              </label>

              {requestError && (
                <p className="service-request-error">{requestError}</p>
              )}

              <div className="service-request-actions">
                <button type="button" onClick={closeRequestForm}>
                  Cancelar
                </button>
                <button type="submit" disabled={submitting}>
                  {submitting ? "Enviando..." : "Enviar solicitud"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default Services;
