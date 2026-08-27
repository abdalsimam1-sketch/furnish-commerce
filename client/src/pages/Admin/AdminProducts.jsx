import { useState } from "react";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";

export const AdminProducts = () => {
  const { getProductsQuery } = useProducts();
  const { categoriesQuery } = useCategories();
  const { data: categoriesResponse } = categoriesQuery;
  const categories = categoriesResponse?.data?.categories;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const { data: response, isLoading } = getProductsQuery(
    page,
    9,
    search,
    categoryId,
  );
  const products = response?.data?.products;

  return (
    <div className="container d-flex flex-column gap-3 min-vh-100">
      <h3 className="my-4 text-center ">Products</h3>
      <button className="align-self-end btn btn-sm bg-dark text-light">
        Add Product
      </button>
      <section className="d-flex flex-column gap-3 flex-md-row justify-content-md-between">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          name=""
          id=""
          className="form-control product-search"
          placeholder="Search a product name...."
        />
        <select
          className="form-select product-dropdown"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Choose a category</option>
          {categories?.map((item) => (
            <option key={item?.id} value={item?.id}>
              {item?.name}
            </option>
          ))}
        </select>
      </section>
      {isLoading ? (
        <div className="min-vh-100 d-flex justify-content-center align-items-center">
          <span className="spinner-border"></span>
        </div>
      ) : (
        <div className="row g-3 flex-grow-1 min">
          {products?.map((item) => (
            <div className="col-12 col-md-6 col-lg-4" key={item.id}>
              <div className="card">
                <img
                  className="w-100 rounded-top"
                  src={item.image}
                  alt={item.name}
                  style={{ width: "300px", height: "300px" }}
                />
                <div className="px-3 d-flex flex-column gap-2">
                  <span className="fw-bold text-secondary">
                    {item?.category?.name}
                  </span>
                  <span className="fw-bold">{item?.name}</span>
                  <span className="fw-bold">
                    ₦{Number(item?.price).toLocaleString()}
                  </span>
                  <hr />
                  <div className="d-flex gap-3 mb-3">
                    <button className="btn bg-dark text-light w-100 btn-sm">
                      Edit
                    </button>
                    <button className="btn btn-outline-danger w-100 btn-sm">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {products?.length > 0 && (
        <span className="align-self-end d-flex align-items-center">
          <i
            className="bi bi-chevron-left btn btn-sm"
            onClick={() => {
              setPage((current) => (current > 1 ? current - 1 : current));
            }}
          ></i>
          <span>
            {page} of {response?.data?.totalPages}
          </span>
          <i
            className="bi bi-chevron-right btn btn-sm"
            onClick={() => {
              setPage((current) =>
                current < response?.data?.totalPages ? current + 1 : current,
              );
            }}
          ></i>
        </span>
      )}
    </div>
  );
};
