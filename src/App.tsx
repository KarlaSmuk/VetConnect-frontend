import { Route, Routes } from "react-router-dom";
import Home from "./pages/HomePage";
import VetClinics from "./pages/VetClinicsPage";
import Login from "./pages/login/LoginPage";
import OtpVerification from "./pages/login/OtpPage";
import ChangePassword from "./pages/login/ChangePasswordPage";
import Owners from "./pages/veterinarian/OwnersPage";
import Vets from "./pages/VetsPage";
import PrivateRoute from "./auth/privateRoute";
import Profile from "./pages/ProfilePage";
import { ROLE } from '../src/enums/roles.enum';
import Pets from "./pages/PetsPage";
import Supplies from "./pages/veterinarian/SuppliesPage";
import Treatments from "./pages/veterinarian/TreatmentsPage";
import Visits from "./pages/VisitsPage";

export default function App() {
  return (
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/clinics' element={<VetClinics />} />
        <Route path='/login' element={<Login />} />
        <Route path='/otpVerification' element={<OtpVerification />} />
        <Route path='/changePassword' element={<ChangePassword />} />
        <Route path='/owners' element={<PrivateRoute component={Owners} roles={ROLE.VET} />} />
        <Route path='/treatments/:clinicId' element={<PrivateRoute component={Treatments} roles={ROLE.VET} />} />
        <Route path='/supplies/' element={<PrivateRoute component={Supplies} roles={ROLE.VET} />} />
        <Route path='/veterinarians/:clinicId' element={<PrivateRoute component={Vets} roles={ROLE.ADMIN} />} />
        <Route path='/profile' element={<PrivateRoute component={Profile} roles={[ROLE.VET, ROLE.ADMIN, ROLE.OWNER]} />} />
        <Route path='/owner/:ownerId' element={<PrivateRoute component={Pets} roles={[ROLE.OWNER, ROLE.VET]} />} />
        <Route path='/pet/:petId' element={<PrivateRoute component={Visits} roles={[ROLE.OWNER, ROLE.VET]} />} />
      </Routes>
  )
}
