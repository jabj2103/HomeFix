import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../services/authService";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
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
      await registerUser(formData);
      navigate("/products");
    } catch (error) {
      console.error(error);
      setError(
        "No se pudo crear la cuenta. Revisa los datos o intenta con otro correo."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-header">
          <p>HomeFix</p>
          <h1>Crear cuenta</h1>
          <span>Regístrate para comprar productos y solicitar servicios.</span>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Nombre completo
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              maxLength="128"
              required
            />
          </label>

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
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="auth-link">
          Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
        </p>
      </section>
    </main>
  );
}

export default Register;
