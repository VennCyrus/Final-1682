import React from "react";
import { authStyles as styles } from "@/assets/dummystyle";
import { useState, useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "@/utils/helper";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/ApiPath";
import { Input } from "./Inputs";

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
      setError(
        error.response?.data?.message ||
          "Something went wrong, please try again"
      );
    }
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
