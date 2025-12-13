import React from "react";
import { authStyles as styles } from "@/assets/dummystyle";
import { useState, useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "@/utils/helper";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/ApiPath";
import { Input } from "./Inputs";
import { GoogleLogin } from '@react-oauth/google';

const Register = ({ setCurrentPage }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handRegister = async (e) => {
    e.preventDefault();
    if (!fullName) {
      setError("Full name is required");
      return;
    }
    if (!validateEmail(email)) {
      setError("Invalid email address");
      return;
    }
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    setError("");
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email: email,
        password: password,
      });
      const { token } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.code === "ERR_NETWORK" || !error.response) {
        setError("Cannot connect to server. Please check if backend is running on http://localhost:4000");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong, please try again");
      }
      console.error("Registration error:", error);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError("");
      if (!credentialResponse?.credential) {
        setError("Google authentication failed. Please try again.");
        return;
      }
      const response = await axiosInstance.post(API_PATHS.AUTH.GOOGLE_LOGIN, {
        credential: credentialResponse.credential,
      });
      const { token } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard");
      } else {
        setError("Google registration failed. No token received.");
      }
    } catch (error) {
      if (error.code === "ERR_NETWORK" || !error.response) {
        setError("Cannot connect to server. Please check if backend is running on http://localhost:4000");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Google registration failed. Please try again.");
      }
      console.error("Google registration error:", error);
    }
  };

  const handleGoogleError = () => {
    setError("Google registration failed. Please try again.");
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.headerWrapper}>
        <h3 className={styles.signupTitle}>Create Account</h3>
        <p className={styles.signupSubtitle}>
          Join thousands Of professionals today
        </p>
      </div>
      {/* Form */}
      <form className={styles.signupForm} onSubmit={handRegister}>
        <Input
          value={fullName}
          onChange={({ target }) => setFullName(target.value)}
          placeholder="John Doe"
          label="Full Name"
          type="text"
        />

        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          placeholder="email@example.com"
          label="Email"
          type="email"
        />

        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          placeholder="Min 8 characters"
          label="Password"
          type="password"
        />

        {error && <p className={styles.errorMessage}>{error}</p>}

        <button type="submit" className={styles.signupSubmit}>
          Create Account
        </button>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500 font-medium">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Google Login Button */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
            theme="outline"
            size="large"
            text="signup_with"
            shape="rectangular"
          />
        </div>

        {/* footer */}
        <p className={styles.switchText}>
          Already have an account?{" "}
          <button
          type="button"
            className={styles.signupSwitchButton}
            onClick={() => setCurrentPage("login")}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default Register;
