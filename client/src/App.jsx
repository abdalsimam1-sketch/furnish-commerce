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

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Routes>
        <Route element={<Layout></Layout>}>
          <Route path="/" element={<Home></Home>}></Route>
          <Route
            path="/products/:categoryId"
            element={<Products></Products>}
          ></Route>
          <Route path="/shop" element={<Shop></Shop>}></Route>
          <Route path="/orders" element={<Orders></Orders>}></Route>
          <Route path="/checkout" element={<Checkout></Checkout>}></Route>
          <Route
            path="/order-success/:orderId"
            element={<OrderSuccess></OrderSuccess>}
          ></Route>
        </Route>

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
