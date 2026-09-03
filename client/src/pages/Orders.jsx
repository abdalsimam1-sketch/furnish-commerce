import { useRef, useState } from "react";
import { useOrders } from "../hooks/useOrders";

export const Orders = () => {
  const { getUsersOrdersQuery, cancelOrderMutation } = useOrders();
  const { data: response, isLoading, isError, error } = getUsersOrdersQuery;
  const orders = response?.data?.orders;

  const [selectedOrder, setSelectedOrder] = useState(null);
  const dialogRef = useRef(null);

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
    <div className="container min-vh-100">
      <h2 className="text-center my-3">Orders</h2>
      <div className="row g-3">
        {orders?.map((item) => (
          <details className="card w-100 p-3 bg-secondary-subtle" key={item.id}>
            <summary className="d-flex justify-content-between">
              <div className="d-flex flex-column gap-1">
                <span className="fw-bold">
                  Order ID: #{item?.id?.slice(0, 8)}
                </span>
                <span>{new Date(item?.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span
                  className={`text-capitalize badge ${item.status === "pending" ? "bg-warning" : item.status === "confirmed" ? "bg-success" : "bg-danger"}`}
                >
                  {item?.status}
                </span>
              </div>
            </summary>

            <div className="d-flex flex-column gap-2">
              <hr />
              {item?.orderItems.map((orderItem) => (
                <div
                  key={orderItem.id}
                  className="d-flex justify-content-between"
                >
                  <span>
                    {orderItem?.product?.name} x {orderItem?.quantity}
                  </span>
                  <span>₦{Number(orderItem?.price).toLocaleString()}</span>
                </div>
              ))}
              <div className="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span>₦{Number(item?.total).toLocaleString()}</span>
              </div>
              {item?.status === "pending" && (
                <button
                  className="btn btn-sm btn-outline-danger align-self-end"
                  onClick={() => {
                    setSelectedOrder(item);
                    dialogRef.current.showModal();
                  }}
                >
                  {selectedOrder?.id === item?.id &&
                  cancelOrderMutation.isPending
                    ? "Cancelling..."
                    : "Cancel order"}
                </button>
              )}
            </div>
          </details>
        ))}
      </div>
      <dialog ref={dialogRef} className="rounded">
        <div className="d-flex flex-column gap-3">
          <span className="text-center">
            Are you sure you want to cancel this order ?
          </span>
          <div className="d-flex gap-3">
            <button
              className="btn btn-sm bg-dark text-light w-100"
              onClick={() => {
                cancelOrderMutation.mutate(selectedOrder.id);
                dialogRef.current.close();
              }}
            >
              Yes
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger w-100"
              onClick={() => {
                dialogRef.current.close();
              }}
            >
              No
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};
