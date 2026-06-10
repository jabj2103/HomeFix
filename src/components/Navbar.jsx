import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getCartItems,
  getCartItemsCount,
  subscribeToCartUpdates,
} from "../services/cartService";
import {
  getCurrentUser,
  logoutUser,
  subscribeToAuthUpdates,
  userHasLabel,
} from "../services/authService";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(() =>
    getCartItemsCount(getCartItems())
  );
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    function refreshCartCount() {
      setCartCount(getCartItemsCount(getCartItems()));
    }

    return subscribeToCartUpdates(refreshCartCount);
  }, []);

  useEffect(() => {
    async function refreshUser() {
      setAuthLoading(true);
      setUser(await getCurrentUser());
      setAuthLoading(false);
    }

    refreshUser();
    return subscribeToAuthUpdates(refreshUser);
  }, []);

  async function handleLogout() {
    await logoutUser();
    setUser(null);
    navigate("/login", { replace: true });
  }

  return (
    <header className="site-navbar">
      <Link className="site-navbar-brand" to="/">
        HomeFix
      </Link>

      <nav className="site-navbar-links" aria-label="Navegacion principal">
        <NavLink to="/products">Productos</NavLink>
        <NavLink to="/services">Servicios</NavLink>
        <NavLink to="/privacy">Privacidad</NavLink>
        <NavLink className="site-navbar-cart" to="/cart">
          Carrito
          <span className="site-navbar-cart-count">{cartCount}</span>
        </NavLink>

        {user ? (
          <div className="site-navbar-user">
            <NavLink to="/profile">Perfil</NavLink>
            {userHasLabel(user, "admin") && (
              <NavLink to="/admin">Administración</NavLink>
            )}
            <span>{user.name || user.email}</span>
            <button type="button" onClick={handleLogout}>
              Cerrar sesion
            </button>
          </div>
        ) : (
          !authLoading && (
            <>
              <NavLink to="/login">Ingresar</NavLink>
              <NavLink to="/register">Registro</NavLink>
            </>
          )
        )}
      </nav>
    </header>
  );
}

export default Navbar;
