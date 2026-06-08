import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../services/authService";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      await loginUser(formData);
      navigate("/products");
    } catch (error) {
      console.error(error);
      setError("No se pudo iniciar sesion. Revisa tu correo y contrasena.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-header">
          <p>HomeFix</p>
          <h1>Iniciar sesion</h1>
          <span>Accede para gestionar tus compras y solicitudes.</span>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Correo
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Contrasena
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              minLength="8"
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar sesion"}
          </button>
        </form>

        <p className="auth-link">
          No tienes cuenta? <Link to="/register">Registrate</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;
