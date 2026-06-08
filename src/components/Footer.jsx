import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <p className="site-footer-brand">HomeFix</p>
        <p>Soluciones para el hogar con atención segura y confiable.</p>
      </div>

      <nav className="site-footer-links" aria-label="Enlaces del pie de página">
        <Link to="/products">Productos</Link>
        <Link to="/services">Servicios</Link>
        <Link to="/privacy-policy">Política de privacidad</Link>
      </nav>
    </footer>
  );
}

export default Footer;
