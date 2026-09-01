import { useEffect, useState } from "react";
import { useCart } from "../hooks/useCart";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { LoginRequired } from "../components/LoginRequired";
import toast from "react-hot-toast";

export const Shop = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { addToCartMutation } = useCart();
  const { getProductsQuery } = useProducts();
  const { categoriesQuery } = useCategories();
  const { data: categoriesResponse } = categoriesQuery;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [adding, setAdding] = useState(null);
  const {
    data: resposne,
    isLoading,
    isError,
    error,
  } = getProductsQuery(page, 9, search, categoryId);
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
      {isError ? (
        <div className="min-vh-100 d-flex justify-content-center align-items-center ">
          <span className="alert alert-danger">
            {error?.response?.data?.message ||
              "Something went wrong, please try again later"}
          </span>
        </div>
      ) : isLoading ? (
        <div className=" d-flex justify-content-center align-items-center flex-grow-1">
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
                      className={`btn btn-sm text-light ${addToCartMutation.isPending && adding?.id === product.id ? "bg-secondary" : "bg-dark"}`}
                      onClick={() => {
                        setAdding(product);
                        addToCartMutation.mutate(
                          { productId: product?.id, quantity: 1 },
                          {
                            onError: (error) => {
                              if (error?.response?.status === 401) {
                                setLoginModalOpen(true);
                              }
                              toast.error("Item was not added to cart");
                            },
                          },
                        );
                      }}
                    >
                      {adding?.id === product.id && addToCartMutation.isPending
                        ? "Adding to cart..."
                        : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {products?.length > 0 && (
        <span className="d-flex align-items-center gap-2 align-self-end">
          <span
            className="bi bi bi-chevron-left btn "
            onClick={() => {
              setPage((current) => (current > 1 ? current - 1 : current));
            }}
          ></span>
          <span>
            Page {page} of {resposne?.data?.totalPages}
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
      )}
      {loginModalOpen && (
        <LoginRequired onClose={() => setLoginModalOpen(false)}></LoginRequired>
      )}
    </div>
  );
};
