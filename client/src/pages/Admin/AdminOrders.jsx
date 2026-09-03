import { useState } from "react";
import { useOrders } from "../../hooks/useOrders";
import { useNavigate } from "react-router-dom";

export const AdminOrders = () => {
  const navigate = useNavigate();
  const { getOrdersQuery, updateOrderMutation } = useOrders();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const {
    data: response,
    isError,
    isLoading,
    error,
  } = getOrdersQuery(page, 9, search, status);
  const orders = response?.data?.orders;

  return (
    <div className="container d-flex flex-column gap-3 min-vh-100 mb-5">
      <header>
        <h3 className="my-4 text-center">Orders</h3>
      </header>
      <i
        className="bi bi-chevron-left btn align-self-start"
        onClick={() => navigate("/admin/dashboard")}
      >
        Back
      </i>
      <div className="d-flex flex-column gap-3 flex-md-row justify-content-md-between">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          type="text"
          className="form-control product-search"
          placeholder="Search by name, email, phone, or city..."
        />
        <select
          className="form-select product-dropdown"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Choose status</option>
          <option value="cancelled">Cancelled</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
        </select>
      </div>
      <div className="flex-grow-1">
        {isError ? (
          <div className="min-vh-100 d-flex justify-content-center align-items-center">
            <span className="alert alert-danger">
              {error?.response?.data?.message}
            </span>
          </div>
        ) : isLoading ? (
          <div className="min-vh-50 d-flex justify-content-center align-items-center">
            <span className="spinner-border"></span>
          </div>
        ) : (
          <div className="row g-3">
            {orders?.map((item) => (
              <details key={item?.id} className="card p-3">
                <summary>
                  <span
                    className={`text-capitalize badge ${item.status === "pending" ? "bg-warning" : item.status === "confirmed" ? "bg-success" : "bg-danger"}`}
                  >
                    {item?.status}
                  </span>
                  <div>
                    <span>
                      {item?.firstName} {item?.lastName}
                    </span>
                    <div className="d-flex justify-content-between">
                      <span>
                        {new Date(item?.createdAt).toLocaleDateString()}
                      </span>
                      <span>₦{Number(item?.total).toLocaleString()}</span>
                    </div>
                  </div>
                </summary>
                <hr />
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex flex-column">
                    <h6 className="text-muted fw-bold border-bottom">
                      Contact
                    </h6>
                    <span>{item?.email}</span>
                    <span>{item?.phone}</span>
                  </div>
                  <div className="d-flex flex-column">
                    <h6 className="text-muted fw-bold border-bottom">
                      Shipping Address
                    </h6>
                    <span>
                      {item?.streetAddress}, {item?.city}, {item?.state},{" "}
                      {item?.country}. {item?.zipCode}
                    </span>
                  </div>
                  <div className="d-flex flex-column">
                    <h6 className="text-muted fw-bold border-bottom">Items</h6>
                    <div>
                      {item?.orderItems?.map((orderItem) => (
                        <div
                          key={orderItem?.id}
                          className="d-flex justify-content-between border-bottom"
                        >
                          <span>{orderItem?.product?.name}</span>
                          <span>
                            ₦{Number(orderItem?.price).toLocaleString()}
                          </span>
                        </div>
                      ))}

                      <div className="d-flex justify-content-between">
                        <span className="fw-bold">Total</span>
                        <span>₦{Number(item?.total).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="status">Update Order Status</label>
                    <select
                      className="form-select product-dropdown"
                      onChange={(e) => {
                        updateOrderMutation.mutate({
                          orderId: item?.id,
                          newStatus: e.target.value,
                        });
                      }}
                    >
                      <option value="">Choose status</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                    </select>
                  </div>
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
      {orders?.length > 0 && (
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
