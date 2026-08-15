import React from "react";

export const Footer = () => {
  return (
    <div className="bg-dark text-light p-4 text-center text-md-start mt-3">
      <footer className="container">
        <section className="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center">
          <div>
            <h1>Furnish</h1>
          </div>
          <div className="d-flex flex-column flex-md-row gap-3">
            <span className="cursor-pointer fw-bold">Home</span>
            <span className="cursor-pointer fw-bold">Shop</span>
            <span className="cursor-pointer fw-bold">Categories</span>
            <span className="cursor-pointer fw-bold">Contact Us</span>
          </div>
        </section>
        <hr className="" />
        <section className="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center">
          <div className="d-flex flex-column gap-2 gap-md-5 flex-md-row">
            <span>Copyright &copy; 2026 Furnish. All rights reserved</span>
            <span className="fw-bold cursor-pointer">Privacy Policiy</span>
            <span className="fw-bold cursor-pointer">Terms of Use</span>
          </div>
          <div className="d-flex gap-3 fs-3 mx-auto mx-md-0">
            <i className="bi bi-instagram cursor-pointer"></i>
            <i className="bi bi-facebook cursor-pointer"></i>
            <i className="bi bi-youtube cursor-pointer"></i>
          </div>
        </section>
      </footer>
    </div>
  );
};
