import { useParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";
import { LoginRequired } from "../components/LoginRequired";
import { useEffect, useState } from "react";

export const Products = () => {
  const { categoryId } = useParams();
  const { addToCartMutation } = useCart();
  const { getCategoryProductsQuery } = useProducts(categoryId);
  const products = getCategoryProductsQuery.data?.data?.products ?? [];
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = loginModalOpen ? "hidden" : "auto";
  });

  if (getCategoryProductsQuery.isPending) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <span className="spinner-border"></span>
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
                  <button
                    className="btn btn-sm bg-dark text-light"
                    onClick={() => {
                      addToCartMutation.mutate(
                        { productId: product.id, quantity: 1 },
                        {
                          onError: (error) => {
                            if (error.response.status === 401) {
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
      {loginModalOpen && (
        <LoginRequired onClose={() => setLoginModalOpen(false)}></LoginRequired>
      )}
    </div>
  );
};
