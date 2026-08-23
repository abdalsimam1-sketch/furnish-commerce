import { useCart } from "../hooks/useCart";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
export const Cart = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    getCartQuery,
    increaseMutation,
    decreaseMutation,
    removeItemMutation,
    clearCartMutation,
  } = useCart();
  const cart = getCartQuery.data;
  console.log(cart);

  const total = cart?.data?.cart?.reduce(
    (sum, item) => sum + Number(item.product.price) * Number(item.quantity),
    0,
  );

  const rowIsPending = (item) => {
    return (
      (increaseMutation.isPending &&
        increaseMutation.variables === item?.product?.id) ||
      (decreaseMutation.isPending &&
        decreaseMutation.variables === item?.product?.id) ||
      (removeItemMutation.isPending &&
        removeItemMutation.variables === item?.product?.id)
    );
  };

  return (
    <div
      className={`cart bg-light p-3 d-flex flex-column gap-3 ${isOpen ? "open" : ""}`}
    >
      <i
        className="bi bi-x fs-1 cursor-pointer align-self-end"
        onClick={onClose}
      ></i>

      <div className="d-flex flex-column gap-3 flex-grow-1 cart-items">
        {cart?.data?.cart.map((item) => (
          <div key={item.id} className="d-flex gap-3 border-bottom pb-3">
            <img
              className="cart-img rounded"
              src={item?.product?.image}
              alt={item?.product?.name}
            />
            <div className="d-flex flex-column flex-grow-1 justify-content-between">
              <span className="text-secondary fw-bold">
                {item?.product?.name}
              </span>
              <span className="fw-bold">
                ₦{Number(item?.product?.price).toLocaleString()}
              </span>
              <div className="d-flex justify-content-between">
                {rowIsPending(item) ? (
                  <span className="spinner-border cart-spinner"></span>
                ) : (
                  <span className="d-flex gap-2 align-items-center">
                    <button
                      className="btn"
                      onClick={() =>
                        decreaseMutation.mutate(item?.product?.id, {
                          onSuccess: () => {
                            toast.success("Item quantity decreased");
                          },
                          onError: (error) => {
                            toast.error(
                              error?.response?.data?.message ||
                                "Something went wrong",
                            );
                          },
                        })
                      }
                    >
                      -
                    </button>
                    <span>{item?.quantity}</span>
                    <button
                      className="btn"
                      onClick={() =>
                        increaseMutation.mutate(item?.product?.id, {
                          onSuccess: () => {
                            toast.success("Item quantity increased");
                          },
                          onError: (error) => {
                            toast.error(
                              error?.response?.data?.message ||
                                "Something went wrong",
                            );
                          },
                        })
                      }
                    >
                      +
                    </button>
                  </span>
                )}
                {rowIsPending(item) ? (
                  <span className="spinner-border cart-spinner"></span>
                ) : (
                  <button
                    className="btn"
                    onClick={() =>
                      removeItemMutation.mutate(item?.product?.id, {
                        onSuccess: () => {
                          toast.success("Item removed");
                        },
                        onError: (error) => {
                          toast.error(
                            error?.response?.data?.message ||
                              "Something went wrong",
                          );
                        },
                      })
                    }
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {cart?.data?.cart?.length > 0 &&
        (clearCartMutation.isPending ? (
          <span className="spinner-border cart-spinner align-self-end"></span>
        ) : (
          <button
            className="align-self-end btn"
            onClick={() =>
              clearCartMutation.mutate(undefined, {
                onSuccess: () => {
                  toast.success("Cart cleared");
                },
                onError: (error) => {
                  toast.error(
                    error?.response?.data?.message || "Something went wrong",
                  );
                },
              })
            }
          >
            Clear cart
          </button>
        ))}
      <div className="total-section d-flex flex-column gap-5">
        <h5>Total : ₦{total?.toLocaleString() ?? 0.0} </h5>
        <button
          className="btn bg-dark text-light w-100 mb-5 mb-md-0"
          onClick={() => {
            navigate("/checkout");
            onClose();
          }}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};
