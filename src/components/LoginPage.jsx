import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // New state for success messages
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth(); // Removed signInWithGoogle from destructuring
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage(""); // Clear any previous message

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      navigate("/");
    } catch (err) {
      // Check if it's an email confirmation error
      if (err.message.includes("Email not confirmed")) {
        setMessage("Пожалуйста, проверьте вашу почту и подтвердите адрес электронной почты.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Removed handleGoogleSignIn function

  return (
    <motion.div
      className="auth-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <Helmet>
        <title>Вход - Apex Tourism</title>
      </Helmet>
      <motion.div 
        className="auth-form"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
      >
        <h2>Вход</h2>
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <motion.button 
            type="submit" 
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            {loading ? "Вход..." : "Войти"}
          </motion.button>
        </form>
        
        {/* Removed Google login button and divider */}
        
        <div className="auth-links">
          <p>
            Нет аккаунта? <Link to="/signup">Зарегистрироваться</Link>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}