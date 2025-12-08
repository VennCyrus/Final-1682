import React from "react";
import { useState, useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "@/utils/helper";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/ApiPath";
import { Input } from "./Inputs";
import { authStyles as styles } from "@/assets/dummystyle";

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handLogin = async (e) => {
    e.preventDefault();
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
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
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
    <div className={styles.container}>
      <div className={styles.headerWrapper}>
        <h3 className={styles.title}>Login</h3>
        <p className={styles.subtitle}>Welcome back to our platform</p>
      </div>
      <form className={styles.form} onSubmit={handLogin}>


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

        <button type="submit" className={styles.submitButton}>
          Login
        </button>
        <p className={styles.switchText}>
          Don't have an account?{" "}
          <button
          type="button"
            className={styles.signupSwitchButton}
            onClick={() => setCurrentPage("register")}
          >
            Register
          </button>
        </p>

      </form>
    </div>
  );
};

export default Login;
