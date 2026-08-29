import { useUsers } from "../../hooks/useUsers";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const AdminUsers = () => {
  const navigate = useNavigate();
  const { getUsersQuery } = useUsers();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data: response } = getUsersQuery(page, 20, search);
  const users = response?.data?.users;

  return (
    <div className="container d-flex flex-column gap-4 mb-5 min-vh-100">
      <h3 className="my-4 text-center">Users</h3>
      <i
        className="bi bi-chevron-left btn align-self-start"
        onClick={() => {
          navigate("/admin/dashboard");
        }}
      >
        Back
      </i>
      <input
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        type="text"
        placeholder="Search by name, email or phone"
        className="form-control product-search"
      />
      <div className="table-responsive flex-grow-1">
        <table className="table table-hover text-nowrap">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Verified</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((item) => (
              <tr key={item?.id}>
                <td>{item?.name}</td>
                <td>{item?.email}</td>
                <td>{item?.phone || "-"}</td>
                <td>
                  {item?.isVerified ? (
                    <span className="badge bg-success">Verified</span>
                  ) : (
                    <span className="badge bg-warning">Unverified</span>
                  )}
                </td>
                <td>{new Date(item?.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {users?.length > 0 && (
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
