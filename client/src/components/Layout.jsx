import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";
import { Cart } from "./Cart";
import { useState } from "react";
import { useEffect } from "react";

export const Layout = () => {
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "auto";
  }, [cartOpen]);
  return (
    <div className="d-flex flex-column min-vh-100">
      <div>
        <ScrollToTop></ScrollToTop>
        <Navbar onCartClick={() => setCartOpen(true)}></Navbar>
      </div>
      <div className="flex-grow-1">
        <Outlet></Outlet>
      </div>
      <div>
        <Footer></Footer>
        {cartOpen && (
          <div className="overlay" onClick={() => setCartOpen(false)}></div>
        )}
        <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)}></Cart>
      </div>
    </div>
  );
};
