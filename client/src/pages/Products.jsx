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
  const [adding, setAdding] = useState(null);

  useEffect(() => {
    document.body.style.overflow = loginModalOpen ? "hidden" : "auto";
  }, [loginModalOpen]);

  if (getCategoryProductsQuery.isError) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <span className="alert alert-danger">
          {getCategoryProductsQuery.error?.response?.data?.message}
        </span>
      </div>
    );
  }
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
        {products.length === 0 ? (
          <p>No products available currently, please try again later</p>
        ) : (
          products.map((product) => (
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
                      disabled={
                        addToCartMutation.isPending &&
                        product?.id === adding?.id
                      }
                      className={`btn btn-sm text-light ${
                        addToCartMutation.isPending &&
                        product?.id === adding?.id
                          ? "bg-secondary"
                          : "bg-dark"
                      }`}
                      onClick={() => {
                        setAdding(product);
                        addToCartMutation.mutate(
                          { productId: product.id, quantity: 1 },
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
                      {addToCartMutation.isPending && product?.id === adding?.id
                        ? "Adding to cart..."
                        : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {loginModalOpen && (
        <LoginRequired onClose={() => setLoginModalOpen(false)}></LoginRequired>
      )}
    </div>
  );
};
