import { useEffect, useState } from "react";
import { useCart } from "../hooks/useCart";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { LoginRequired } from "../components/LoginRequired";

export const Shop = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { addToCartMutation } = useCart();
  const { getProductsQuery } = useProducts();
  const { categoriesQuery } = useCategories();
  const { data: categoriesResponse } = categoriesQuery;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const { data: resposne, isLoading } = getProductsQuery(
    page,
    9,
    search,
    categoryId,
  );
  const products = resposne?.data?.products;
  const categories = categoriesResponse?.data?.categories;

  useEffect(() => {
    document.body.style.overflow = loginModalOpen ? "hidden" : "auto";
  }, [loginModalOpen]);

  return (
    <div className="all-products container d-flex flex-column gap-3 min-vh-100">
      <h4 className="text-center my-4">Shop</h4>
      <div className="d-flex flex-column  flex-md-row gap-3 justify-content-md-between">
        <form className="w-100">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            type="text"
            className="form-control product-search"
            placeholder="Search product names"
          />
        </form>
        <select
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setPage(1);
          }}
          className="form-select product-dropdown"
        >
          <option value="">Choose category</option>
          {categories?.map((item) => (
            <option value={item?.id} key={item?.id}>
              {item?.name}
            </option>
          ))}
        </select>
      </div>
      {isLoading ? (
        <div className="min-vh-100 d-flex justify-content-center align-items-center">
          <span className="spinner-border"></span>
        </div>
      ) : products?.length === 0 ? (
        <div className="text-center py-5 text-muted flex-grow-1">
          No products found matching your search.
        </div>
      ) : (
        <div className="row g-3 products-section flex-grow-1">
          {products?.map((product) => (
            <div key={product?.id} className="col-12 col-md-6 col-lg-4">
              <div className="card ">
                <img
                  loading="lazy"
                  className="w-100 rounded-top"
                  src={product?.image}
                  alt={product?.name}
                  style={{
                    height: "16rem",
                    objectFit: "cover",
                  }}
                />
                <div className="d-flex flex-column p-3">
                  <span className="text-muted fw-bold text-uppercase">
                    {product?.category?.name}
                  </span>
                  <span>{product?.name}</span>
                  <hr />
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="fw-bold">
                      ₦{Number(product?.price).toLocaleString()}
                    </span>
                    <button
                      className="btn btn-sm bg-dark text-light"
                      onClick={() => {
                        addToCartMutation.mutate(
                          { productId: product?.id, quantity: 1 },
                          {
                            onError: (error) => {
                              if (error?.response?.status === 401) {
                                setLoginModalOpen(true);
                              }
                            },
                          },
                        );
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <span className="d-flex align-items-center gap-2 align-self-end">
        <span
          className="bi bi bi-chevron-left btn "
          onClick={() => {
            setPage((current) => (current > 1 ? current - 1 : current));
          }}
        ></span>
        <span>
          Page {products?.length === 0 ? 0 : page} of{" "}
          {resposne?.data?.totalPages ?? 0}
        </span>
        <span
          className="bi bi-chevron-right btn "
          onClick={() => {
            setPage((current) =>
              current < resposne?.data?.totalPages ? current + 1 : current,
            );
          }}
        ></span>
      </span>
      {loginModalOpen && (
        <LoginRequired onClose={() => setLoginModalOpen(false)}></LoginRequired>
      )}
    </div>
  );
};
