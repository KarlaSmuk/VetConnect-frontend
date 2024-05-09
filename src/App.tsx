import { Route, Routes } from "react-router-dom";
import Home from "./pages/HomePage";
import VetClinics from "./pages/VetClinicsPage";
import Login from "./pages/login/LoginPage";
import OtpVerification from "./pages/login/OtpPage";
import ChangePassword from "./pages/login/ChangePasswordPage";
import Owners from "./pages/veterinarian/OwnersPage";

export default function App() {
  return (
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/clinic' element={<VetClinics />} />
        <Route path='/login' element={<Login />} />
        <Route path='/otpVerification' element={<OtpVerification />} />
        <Route path='/changePassword' element={<ChangePassword />} />
        <Route path='/owner' element={<Owners />} />
      </Routes>
  )
}
