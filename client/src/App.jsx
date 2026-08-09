import { Auth } from "./pages/auth pages/Auth";
import { Home } from "./pages/Home";
import { VerifyEmail } from "./pages/auth pages/VerifyEmail";

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
      </Routes>
    </div>
  );
}

export default App;
