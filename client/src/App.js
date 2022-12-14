import "./index.css";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import Expeditions from "./views/Expeditions";
import Navbar from "./components/Navbar";
import Login from "./views/Login";
import Register from "./views/Register";
import DetailExpedition from "./views/DetailExpedition";
import Leaders from "./views/Leaders";
import Account from "./views/Account";
import { AuthContextProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="expeditions" element={<Expeditions />} />
          <Route path="expeditions/:island" element={<DetailExpedition />} />
          <Route path="leaders" element={<Leaders />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="account" element={<Account />} />
        </Routes>
      </AuthContextProvider>
      <ToastContainer />
    </div>
  );
}

export default App;
