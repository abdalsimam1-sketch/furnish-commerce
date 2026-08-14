import { useEffect, useMemo } from "react";
import { useCategories } from "../hooks/useCategories";
import { useState } from "react";

export const Home = () => {
  const { categoriesQuery } = useCategories();
  const [currentIndex, setCurrentIndex] = useState(0);

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
    <div>
      <section
        className="hero-section d-flex justify-content-between align-items-center px-2 px-md-5"
        style={{ backgroundImage: `url(${currentCategory.image})` }}
      >
        <i
          className="bi-chevron-left  btn bg-light "
          onClick={() =>
            setCurrentIndex(
              (current) =>
                (current - 1 + categories.length) % categories.length,
            )
          }
        ></i>
        <i
          className="bi-chevron-right btn bg-light"
          onClick={() =>
            setCurrentIndex(
              (current) =>
                (current + 1 + categories.length) % categories.length,
            )
          }
        ></i>
      </section>
    </div>
  );
};
