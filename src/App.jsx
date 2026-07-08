import { Routes, Route } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import LandingPage from "./LandingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import CoPoMatrixDashboard from "./pages/CoPoMatrixDashboard";
import CdpReview from "./pages/CdpReview";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route element={<RootLayout />}>
        <Route path="/matrix" element={<CoPoMatrixDashboard />} />
        <Route path="/cdp-review" element={<CdpReview />} />
      </Route>
    </Routes>
  );
}
