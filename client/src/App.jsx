import { Auth } from "./pages/auth pages/Auth";
import { Home } from "./pages/Home";
import { VerifyEmail } from "./pages/auth pages/VerifyEmail";
import { ForgotPassword } from "./pages/auth pages/ForgotPassword";
import { ResetPassword } from "./pages/auth pages/ResetPassword";
import { Products } from "./pages/Products";
import { NotFound } from "./pages/NotFound";
import { Orders } from "./pages/Orders";
import { Shop } from "./pages/Shop";
import { Layout } from "./components/Layout";
import { Checkout } from "./pages/Checkout";
import { OrderSuccess } from "./pages/OrderSuccess";
import { ProtectedRoutes } from "./components/ProtectedRoutes";
import { UserSettings } from "./pages/UserSettings";
import { AdminProducts } from "./pages/Admin/AdminProducts";
import { AdminRoutes } from "./components/AdminRoutes";
import { AdminDashboard } from "./pages/Admin/AdminDashboard";
import { AdminOrders } from "./pages/Admin/AdminOrders";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div style={{ fontFamily: "italics" }}>
      <Routes>
        <Route element={<Layout></Layout>}>
          <Route path="/" element={<Home></Home>}></Route>
          <Route
            path="/products/:categoryId"
            element={<Products></Products>}
          ></Route>
          <Route path="/shop" element={<Shop></Shop>}></Route>
          <Route
            path="/orders"
            element={
              <ProtectedRoutes>
                <Orders></Orders>
              </ProtectedRoutes>
            }
          ></Route>
          <Route
            path="/checkout"
            element={
              <ProtectedRoutes>
                <Checkout></Checkout>
              </ProtectedRoutes>
            }
          ></Route>
          <Route
            path="/order-success"
            element={
              <ProtectedRoutes>
                <OrderSuccess></OrderSuccess>
              </ProtectedRoutes>
            }
          ></Route>
          <Route
            path="/settings"
            element={
              <ProtectedRoutes>
                <UserSettings></UserSettings>
              </ProtectedRoutes>
            }
          ></Route>
        </Route>
        <Route
          path="/admin/products"
          element={
            <AdminRoutes>
              <AdminProducts></AdminProducts>
            </AdminRoutes>
          }
        ></Route>
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoutes>
              <AdminDashboard></AdminDashboard>
            </AdminRoutes>
          }
        ></Route>
        <Route
          path="/admin/orders"
          element={
            <AdminRoutes>
              <AdminOrders></AdminOrders>
            </AdminRoutes>
          }
        ></Route>
        <Route path="/auth" element={<Auth></Auth>}></Route>
        <Route
          path="/verify-email/:token"
          element={<VerifyEmail></VerifyEmail>}
        ></Route>
        <Route
          path="/forgot-password"
          element={<ForgotPassword></ForgotPassword>}
        ></Route>
        <Route
          path="/reset-password/:token"
          element={<ResetPassword></ResetPassword>}
        ></Route>
        <Route path="*" element={<NotFound></NotFound>}></Route>
      </Routes>{" "}
    </div>
  );
}

export default App;
