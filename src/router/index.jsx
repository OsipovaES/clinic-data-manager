import { Routes, Route } from "react-router-dom";
import { Registration } from "../pages/Registration";
import { ControlPanel } from "../pages/ControlPanel";
import { Login } from "../pages/Login";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Registration />} />
      <Route path="/controlPanel" element={<ControlPanel />} />
    </Routes>
  );
};
