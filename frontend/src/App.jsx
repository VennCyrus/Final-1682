import React from "react";
import { Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import LandingPage from "@/pages/LandingPage";
import UserProvider from "@/context/UserContext";
import Dashboard from "@/pages/Dashboard";
import EditResume from "@/components/EditResume";
import AdminDashboard from "@/pages/AdminDashboard";
import { Toaster } from "react-hot-toast";

const App = () => {
  // Use the Google Client ID from your .env or hardcode it
  const GOOGLE_CLIENT_ID = "124027560832-sauvljh41r1ri86kkevh0m1lcn69pefn.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <UserProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resume/:resumeId" element={<EditResume />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>

        <Toaster  toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}/>
      </UserProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
