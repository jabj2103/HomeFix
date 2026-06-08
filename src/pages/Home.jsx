import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero-content">
          <p className="home-eyebrow">Productos y servicios para tu hogar</p>
          <h1>Soluciones HomeFix para comprar, reparar y mejorar tu casa</h1>
          <p className="home-hero-copy">
            Encuentra productos esenciales, solicita servicios técnicos y
            gestiona tus compras desde una plataforma simple, segura y moderna.
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

        <div className="home-hero-panel" aria-label="Resumen HomeFix">
          <div>
            <span>24h</span>
            <p>Solicitudes organizadas por urgencia</p>
          </div>
          <div>
            <span>100%</span>
            <p>Checkout y carrito conectados</p>
          </div>
          <div>
            <span>COP</span>
            <p>Precios claros para Colombia</p>
          </div>
        </div>
      </section>

      <section className="home-feature-grid" aria-label="Beneficios">
        <article>
          <span>01</span>
          <h2>Compra productos</h2>
          <p>
            Agrega artículos al carrito, revisa subtotales y finaliza tu compra
            con un flujo preparado para pagos.
          </p>
        </article>
        <article>
          <span>02</span>
          <h2>Agenda servicios</h2>
          <p>
            Solicita soporte para el hogar con fecha, franja horaria y nivel de
            urgencia para una mejor clasificación.
          </p>
        </article>
        <article>
          <span>03</span>
          <h2>Gestiona tu cuenta</h2>
          <p>
            Crea sesión, conserva tus datos de usuario y navega con una
            experiencia pensada para ecommerce.
          </p>
        </article>
      </section>
    </main>
  );
}

export default Home;
