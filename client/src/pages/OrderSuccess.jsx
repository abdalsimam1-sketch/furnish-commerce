import { useOrders } from "../hooks/useOrders";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const OrderSuccess = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { getSpecificOrderQuery } = useOrders();
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = getSpecificOrderQuery(orderId);
  const order = response?.data?.order;
  console.log(order);

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <span className="spinner-border"></span>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <span className="alert alert-danger">
          {error?.response?.data?.message}
        </span>
      </div>
    );
  }

  return (
    <div className="container card bg-secondary-subtle order-success-section text-center d-flex flex-column align-items-center justify-content-center my-5 pt-5 ">
      <h1 className="rounded">✅</h1>
      <h4>Thank you</h4>
      <span>Your order has been recieved</span>
      <span>You will recieve a confirmation email shortly</span>
      <hr />
      <span className="alert alert-success d-flex justify-content-between w-100">
        <span>Order Id</span>
        <span>#{orderId.slice(0, 8)}</span>
      </span>
      <hr />
      {order?.orderItems.map((item) => (
        <div key={item.id} className="d-flex justify-content-between w-100">
          <span>
            <span className="fw-bold">{item?.product?.name}</span> x{" "}
            <span>{item?.quantity}</span>
          </span>
          <span>₦{Number(item?.price).toLocaleString()}</span>
        </div>
      ))}
      <hr />
      <div className="w-100 d-flex justify-content-between fw-bold">
        <span>Total paid</span>
        <span>₦{Number(order?.total).toLocaleString()}</span>
      </div>
      <div className="w-100 d-flex justify-content-between">
        <span>Paid via Paystack</span>
        <span>{new Date(order?.createdAt).toLocaleDateString()}</span>
      </div>
      <hr />
      <span>
        <i className="bi bi-geo-alt"></i>
        Delivering to {order?.streetAddress}, {order?.city}, {order?.country}
      </span>

      <button
        className="btn bg-dark text-light btn-sm align-self-end my-4"
        onClick={() => navigate("/")}
      >
        Continue Shopping
      </button>
    </div>
  );
};
