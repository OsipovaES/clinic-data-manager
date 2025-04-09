import { Routes, Route } from "react-router-dom";
import { Registration } from "../pages/Registration";
import { Requests } from "../pages/Requests";
import { CreateRequest } from "../pages/CreateRequest";
import { AdminPanel } from "../pages/AdminPanel";
import { Login } from "../pages/Login";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Registration />} />
      <Route path="/requests" element={<Requests />} />
      <Route path="/create-request" element={<CreateRequest />} />
      <Route path="/admin-panel" element={<AdminPanel />} />
    </Routes>
  );
};
