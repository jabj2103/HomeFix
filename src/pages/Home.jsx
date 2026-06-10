import { Link } from "react-router-dom";
import {
  FaClock,
  FaShieldAlt,
  FaShoppingCart,
  FaTools,
  FaUserCheck,
} from "react-icons/fa";
import "./Home.css";

function Home() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero-content">
          <p className="home-eyebrow">Tu hogar, mejor atendido</p>
          <h1>Soluciones confiables para cuidar y mejorar tu hogar</h1>
          <p className="home-hero-copy">
            Encuentra productos esenciales y solicita servicios técnicos con
            información clara, atención organizada y seguimiento desde un solo
            lugar.
          </p>
          <div className="home-actions">
            <Link className="home-primary-action" to="/products">
              Ver productos
            </Link>
            <Link className="home-secondary-action" to="/services">
              Solicitar servicio
            </Link>
          </div>
        </div>

        <div className="home-hero-panel" aria-label="Beneficios HomeFix">
          <article>
            <div className="home-benefit-icon" aria-hidden="true">
              <FaClock />
            </div>
            <div>
              <h2>24h</h2>
              <p>Atención rápida para emergencias del hogar</p>
            </div>
          </article>
          <article>
            <div className="home-benefit-icon" aria-hidden="true">
              <FaShieldAlt />
            </div>
            <div>
              <h2>Verificados</h2>
              <p>Técnicos y servicios con mayor respaldo y confianza</p>
            </div>
          </article>
          <article>
            <div className="home-benefit-icon" aria-hidden="true">
              <FaTools />
            </div>
            <div>
              <h2>Todo en uno</h2>
              <p>
                Productos, servicios, pedidos y solicitudes en una sola
                plataforma
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="home-feature-grid" aria-label="Cómo funciona HomeFix">
        <article>
          <div className="home-feature-heading">
            <div className="home-feature-icon" aria-hidden="true">
              <FaShoppingCart />
            </div>
            <span>01</span>
          </div>
          <h2>Compra productos para el hogar</h2>
          <p>
            Encuentra artículos de plomería, electricidad, herramientas,
            pintura y mantenimiento en un solo lugar.
          </p>
        </article>
        <article>
          <div className="home-feature-heading">
            <div className="home-feature-icon" aria-hidden="true">
              <FaTools />
            </div>
            <span>02</span>
          </div>
          <h2>Solicita servicios técnicos</h2>
          <p>
            Agenda plomería, cerrajería, electricidad o mantenimiento con
            información clara y organizada.
          </p>
        </article>
        <article>
          <div className="home-feature-heading">
            <div className="home-feature-icon" aria-hidden="true">
              <FaUserCheck />
            </div>
            <span>03</span>
          </div>
          <h2>Haz seguimiento desde tu perfil</h2>
          <p>
            Consulta tus pedidos y solicitudes sin depender de llamadas,
            mensajes o procesos informales.
          </p>
        </article>
      </section>
    </main>
  );
}

export default Home;
