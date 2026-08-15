import { Auth } from "./pages/auth pages/Auth";
import { Home } from "./pages/Home";
import { VerifyEmail } from "./pages/auth pages/VerifyEmail";
import { ForgotPassword } from "./pages/auth pages/ForgotPassword";
import { ResetPassword } from "./pages/auth pages/ResetPassword";
import { Products } from "./pages/Products";
import { NotFound } from "./pages/NotFound";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
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
        <Route
          path="/products/:categoryId"
          element={<Products></Products>}
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
