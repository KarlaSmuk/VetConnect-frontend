import { Route, Routes } from "react-router-dom";
import Home from "./pages/HomePage";
import VetClinics from "./pages/VetClinicsPage";
import Login from "./pages/login/LoginPage";
import OtpVerification from "./pages/login/OtpPage";
import ChangePassword from "./pages/login/ChangePasswordPage";
import Owners from "./pages/veterinarian/OwnersPage";
import Vets from "./pages/VetsPage";
import PrivateRoute from "./auth/privateRoute";
import { ROLE } from "./enums/roles.enum";

export default function App() {
  return (
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/clinics' element={<VetClinics />} />
        <Route path='/login' element={<Login />} />
        <Route path='/otpVerification' element={<OtpVerification />} />
        <Route path='/changePassword' element={<ChangePassword />} />
        <Route path='/owners' element={<PrivateRoute component={Owners} roles={ROLE.VET} />} />
        <Route path='/veterinarians/:id' element={<Vets />} />
      </Routes>
  )
}
