import { useEffect, useMemo } from "react";
import { useCategories } from "../hooks/useCategories";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HomeData } from "../components/HomeData";
import { homeData } from "../data/homeData";
import { Input } from "../components/Input";
import { useForm } from "react-hook-form";
import { useProducts } from "../hooks/useProducts";

export const Home = () => {
  const { categoriesQuery } = useCategories();
  const { getNewArrivalsQuery } = useProducts();

  const { data: response } = getNewArrivalsQuery;
  const newArrivals = response?.data?.newArrivals;

  const [currentIndex, setCurrentIndex] = useState(0);
  const { hash } = useLocation();
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const categories = useMemo(
    () => categoriesQuery.data?.data?.categories ?? [],
    [categoriesQuery.data],
  );
  const onSubmit = (email) => {};
  const currentCategory = categories[currentIndex];

  useEffect(() => {
    if (categories.length === 0) {
      return;
    }
    const timer = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % categories.length);
    }, 60000);
    return () => clearInterval(timer);
  }, [categories.length]);

  useEffect(() => {
    if (hash === "#contact") {
      document
        .getElementById("contact")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [hash]);

  if (categoriesQuery.isLoading)
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <span className="spinner-border"></span>
      </div>
    );
  if (!currentCategory) return null;
  return (
    <div className="d-flex flex-column gap-5">
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
      <section className="container d-flex flex-column text-center text-lg-start d-lg-flex flex-lg-row align-items-lg-center justify-content-lg-between">
        <div className="d-flex flex-column gap-3">
          <h1 className="text-nowrap">Simply Unique /</h1>
          <h1 className="text-nowrap">Simply Better.</h1>
        </div>

        <span className="simply-text mx-auto mx-lg-0">
          Furnish is a furniture shop based in Abuja, Nigeria. Est since 2026.
        </span>
      </section>
      <hr />
      <section className="new-arrivals-section container d-flex flex-column gap-3">
        <div className="d-flex justify-content-between align-items-center ">
          <h4>New Arrivals</h4>
          <span
            className="border-bottom cursor-pointer"
            onClick={() => navigate("/shop")}
          >
            More products <i className="bi bi-arrow-right"> </i>
          </span>
        </div>
        <div className="d-flex gap-3 overflow-x-auto">
          {newArrivals?.map((item) => (
            <div
              key={item?.id}
              style={{ minWidth: "260px", maxWidth: "260px" }}
            >
              <div className="card">
                <img
                  loading="lazy"
                  className="w-100 rounded-top"
                  src={item?.image}
                  alt={item?.name}
                  style={{
                    height: "16rem",
                    objectFit: "cover",
                  }}
                />
                <div className="d-flex flex-column p-3">
                  <span className="text-muted fw-bold text-uppercase">
                    {item?.category?.name}
                  </span>
                  <span>{item?.name}</span>
                  <hr />
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="fw-bold">
                      ₦{Number(item?.price).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <hr />
      <section className="container">
        <div className="row g-3">
          {homeData.map((item) => (
            <div className="col-12 col-md-6 col-lg-3" key={item.title}>
              <HomeData data={item}></HomeData>
            </div>
          ))}
        </div>
      </section>
      <hr />
      <section className="sale-section d-flex flex-column flex-md-row card">
        <div className="sale-image"></div>
        <div className="d-flex flex-column justify-content-center align-items-center text-center py-5 py-md-0 px-3">
          <span className="text-primary fw-bold text-uppercase">
            sale up to 35% off
          </span>
          <h1>HUNDREDS of New lower prices!</h1>
          <span>
            It's more affordable than ever to gove every room in your home a
            stylish makeover
          </span>

          <span
            className="cursor-pointer border-bottom"
            onClick={() => navigate("/shop")}
          >
            Shop now <i className="bi bi-arrow-right"></i>
          </span>
        </div>
      </section>
      <section
        className="contact-us-section d-flex flex-column justify-content-center align-items-center gap-4"
        id="contact"
      >
        <h2>Join Our Newsletter</h2>
        <span>Sign up for deals, new products and promotions</span>

        <form
          className="contact-us-email-form "
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            placeholder="Email address"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
          ></Input>
        </form>
      </section>
    </div>
  );
};
