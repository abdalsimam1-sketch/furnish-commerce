import { Auth } from "./pages/auth pages/Auth";
import { Home } from "./pages/Home";
import { VerifyEmail } from "./pages/auth pages/VerifyEmail";
import { ForgotPassword } from "./pages/auth pages/ForgotPassword";
import { ResetPassword } from "./pages/auth pages/ResetPassword";
import { Products } from "./pages/Products";
import { NotFound } from "./pages/NotFound";
import { Categories } from "./pages/Categories";
import { Shop } from "./pages/Shop";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <ScrollToTop></ScrollToTop>
      <Navbar></Navbar>
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

        <Route
          path="/products/:categoryId"
          element={<Products></Products>}
        ></Route>
        <Route path="/shop" element={<Shop></Shop>}></Route>
        <Route path="/categories" element={<Categories></Categories>}></Route>
        <Route path="*" element={<NotFound></NotFound>}></Route>
      </Routes>{" "}
      <Footer></Footer>
    </div>
  );
}

export default App;
