import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Loginform = ({ onLogin }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handlechange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleform = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/project/login/",
        form
      );
      const { token, user_id,username} = response.data;
      onLogin(token, user_id,username);
      setMessage("Login successful!");
      setTimeout(() => navigate("/buses"), 1000);
    } catch (error) {
      setMessage(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="container login-container">
      <div className="login-card">
        <h1 className="page-title">Login</h1>

        <form onSubmit={handleform}>
          <label>Username</label>
          <input type="text" name="username" value={form.username} onChange={handlechange}required/>
          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handlechange} required/>
          <button type="submit">Login</button>
        </form>
        {message && <p className="login-message">{message}</p>}
        <p className="register-link">New user? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
};

export default Loginform;
