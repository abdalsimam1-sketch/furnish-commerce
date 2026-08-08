import { Auth } from "./pages/Auth";
import { Home } from "./pages/Home";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/auth" element={<Auth></Auth>}></Route>
      </Routes>
    </div>
  );
}

export default App;
