import { useEffect, useMemo } from "react";
import { useCategories } from "../hooks/useCategories";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const { categoriesQuery } = useCategories();
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const categories = useMemo(
    () => categoriesQuery.data?.data?.categories ?? [],
    [categoriesQuery.data],
  );

  const currentCategory = categories[currentIndex];

  useEffect(() => {
    if (categories.length === 0) {
      return;
    }
    const timer = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % categories.length);
    }, 100000);
    return () => clearInterval(timer);
  }, [categories.length]);

  if (categoriesQuery.isLoading)
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <span className="alert alert-secondary">
          <h3>Loading.....</h3>
        </span>
      </div>
    );
  if (!currentCategory) return null;
  return (
    <div className="d-flex flex-column gap-3">
      <section
        className="hero-section d-flex justify-content-between align-items-center px-2 px-md-5"
        style={{ backgroundImage: `url(${currentCategory.image})` }}
      >
        <i
          className="bi-chevron-left  btn bg-light carousel-btn "
          onClick={() =>
            setCurrentIndex(
              (current) =>
                (current - 1 + categories.length) % categories.length,
            )
          }
        ></i>
        <div className="container text-center d-flex flex-column align-items-center gap-2">
          <h1 className="text-light bg-secondary rounded d-inline-block px-3 py-1">
            {currentCategory.name}
          </h1>
          <button
            className="btn bg-light align-self-center fw-bold"
            onClick={() => navigate(`/products/${currentCategory.id}`)}
          >
            View {currentCategory.name} Products
          </button>
        </div>
        <i
          className="bi-chevron-right btn bg-light carousel-btn"
          onClick={() =>
            setCurrentIndex(
              (current) =>
                (current + 1 + categories.length) % categories.length,
            )
          }
        ></i>
      </section>

      <section className="container d-flex flex-column text-center text-lg-start d-lg-flex flex-lg-row align-items-lg-center justify-content-lg-around">
        <div className="d-flex flex-column gap-3">
          <h1 className="text-nowrap">Simply Unique /</h1>
          <h1 className="text-nowrap">Simply Better.</h1>
        </div>
        <div>
          <span className="text-muted ">
            Furnish is a furniture shop based in Abuja, Nigeria.Est since 2026
          </span>
        </div>
      </section>
    </div>
  );
};
