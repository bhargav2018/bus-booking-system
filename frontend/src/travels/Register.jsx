import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({username: "",email: "",password: ""});
  const [messages, setMessages] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const handlechange = (e) => {setForm({ ...form, 
    [e.target.name]: e.target.value });};
  const handleform = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:8000/project/register/",
        form
      );

      setMessages("Registration successful! Redirecting to login...");
      setIsError(false);

      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      if (
        error.response?.data?.username?.some((msg) =>
          msg.includes("already exists")
        ) ||
        error.response?.data?.email?.some((msg) =>
          msg.includes("already exists")
        )
      ) {
        setMessages("User already registered. Please login instead.");
        setIsError(true);
      } else {
        setMessages(
          "Registration failed: " +
          (error.response?.data?.detail || error.message)
        );
        setIsError(true);
      }
    }
  };

  return (
    <div className="container register-container">
      <div className="register-card">
        <h1 className="page-title">Register</h1>
        <form onSubmit={handleform}>
          <label>Username</label>
          <input type="text" name="username" value={form.username} onChange={handlechange} required/>
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handlechange} required/>
          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handlechange}required/>
          <button type="submit">Register</button>
        </form>
        {messages && (
          <p className={isError ? "register-error" : "register-success"}>{messages}</p>
        )}
        <p className="login-link">Already have an account?<Link to="/login">Go to Login</Link></p>
      </div>
    </div>
  );
};

export default Register;
