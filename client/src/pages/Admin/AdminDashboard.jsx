import { useRef } from "react";
import { useDashboard } from "../../hooks/useDashboard";
import { useProducts } from "../../hooks/useProducts";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  Bar,
  BarChart,
} from "recharts";
import { useNavigate } from "react-router-dom";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const dialogRef = useRef();

  const { getNewArrivalsQuery } = useProducts();
  const {
    data: newArrivalsResponse,
    isLoading: newArrivalsIsLoading,
    isError: newArrivalsIsError,
  } = getNewArrivalsQuery;
  const newArrivals = newArrivalsResponse?.data?.newArrivals;
  console.log("new arrivals", newArrivals);

  const { getDashboardQuery } = useDashboard();
  const {
    data: dashboardResponse,
    isLoading: dashboardIsLoading,
    isError: dashboardError,
  } = getDashboardQuery;

  const dashboard = dashboardResponse?.data;
  console.log("dashboard data", dashboard);

  const stats = [
    { title: "Total revenue", value: dashboard?.totalRevenue, sign: "₦" },
    { title: "Orders count", value: dashboard?.orderCount, sign: "" },
    { title: "Product Count", value: dashboard?.productCount, sign: "" },
    { title: "User count", value: dashboard?.userCount, sign: "" },
  ];
  const statusColors = {
    confirmed: "#1D9E75", // green
    pending: "#EF9F27", // amber
    cancelled: "#E24B4A", // red
  };

  if (dashboardIsLoading || newArrivalsIsLoading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <span className="spinner-border"></span>
      </div>
    );
  }
  return (
    <div className="container py-4 d-flex flex-column gap-3">
      <div className="d-flex align-items-center justify-content-between">
        <h3 className="m-0">Dashboard</h3>
        <button
          className="btn btn-sm align-self-end bg-dark text-light"
          onClick={() => {
            dialogRef.current.showModal();
          }}
        >
          Add New Category
        </button>
      </div>
      <div className="row g-3">
        {stats?.map((item, index) => (
          <div className="col-12 col-md-6 col-lg-3" key={index}>
            <div className="card p-3">
              <span>{item.title}</span>
              <h2>
                {item.sign}
                {Number(item.value).toLocaleString()}
              </h2>
            </div>
          </div>
        ))}
      </div>
      <section className="charts-section row g-3">
        <div className="col-12 col-md-6 ">
          <div className="border rounded">
            {" "}
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dashboard?.orderTrend}>
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
                <YAxis />
                <Bar dataKey="total" fill="#378ADD" />
                <Tooltip
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  formatter={(value) => [
                    `₦${Number(value).toLocaleString()}`,
                    "Revenue",
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="border rounded">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dashboard?.formattedOrderByStatus}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={50}
                  outerRadius={80}
                >
                  {dashboard?.formattedOrderByStatus?.map((item, index) => (
                    <Cell key={index} fill={statusColors[item.status]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} orders`, name]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
      <section className="orders-and-new-arrivals row g-3">
        <div className="col-12 col-md-6">
          <div className="card p-3 h-100">
            <div className="d-flex justify-content-between border-bottom">
              <h5>Latest Orders</h5>
              <i
                className="bi bi-arrow-right cursor-pointer "
                onClick={() => navigate("/admin/orders")}
              >
                See more
              </i>
            </div>
            {dashboard?.latestOrders.map((item) => (
              <div
                className="d-flex justify-content-between align-items-center  border-bottom py-3"
                key={item?.id}
              >
                <span>
                  {item?.firstName} {item?.lastName}
                </span>
                <span>₦{Number(item?.total).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card p-3 h-100">
            <div className="d-flex justify-content-between border-bottom">
              <h5>Latest Products</h5>
              <i
                className="bi bi-arrow-right cursor-pointer "
                onClick={() => navigate("/admin/products")}
              >
                See more
              </i>
            </div>
            {newArrivals?.map((item) => (
              <div
                key={item?.id}
                className="d-flex justify-content-between py-3 border-bottom"
              >
                <span>{item?.name}</span>

                <span
                  className={`badge px-3 rounded-pill ${item?.inStock <= 10 ? "bg-danger" : item?.inStock <= 15 ? "bg-warning" : "bg-success"}`}
                >
                  {item?.inStock}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <dialog ref={dialogRef} className="rounded add-category-modal">
        <div className=" d-flex flex-column gap-3">
          <h5>Create Category</h5>
          <div>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" className="form-control" />
          </div>
          <div>
            <label htmlFor="image">Category image</label>
            <input type="file" id="image" className="form-control" />
          </div>
          <div className="d-flex gap-3 align-self-end">
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => {
                dialogRef.current.close();
              }}
            >
              Cancel
            </button>
            <button className="btn btn-sm bg-dark text-light">Submit</button>
          </div>
        </div>
      </dialog>
    </div>
  );
};
