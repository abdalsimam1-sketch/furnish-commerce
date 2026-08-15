import { useParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";

export const Products = () => {
  const { categoryId } = useParams();
  const { getCategoryProductsQuery } = useProducts(categoryId);
  const products = getCategoryProductsQuery.data?.data?.products ?? [];
  console.log(products);

  if (getCategoryProductsQuery.isPending) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <span className="alert alert-secondary">
          <h3>Loading.....</h3>
        </span>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row g-3">
        {products.map((product) => (
          <div key={product.id} className="col-12 col-md-6 col-lg-4">
            <div className="card ">
              <img
                className="w-100 rounded-top"
                src={product.image}
                alt={product.name}
                style={{
                  height: "16rem",
                  objectFit: "cover",
                }}
              />
              <div className="d-flex flex-column p-3">
                <span className="text-muted fw-bold text-uppercase">
                  {product.category.name}
                </span>
                <span>{product.name}</span>
                <hr />
                <div className="d-flex align-items-center justify-content-between">
                  <span className="fw-bold">
                    ₦{Number(product.price).toLocaleString()}
                  </span>
                  <button className="btn btn-sm bg-dark text-light">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
