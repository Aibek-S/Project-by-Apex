import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

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
    <div className="auth-container">
      <div className="auth-form">
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
          
          <button type="submit" disabled={loading}>
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>
        
        {/* Removed Google login button and divider */}
        
        <div className="auth-links">
          <p>
            Нет аккаунта? <Link to="/signup">Зарегистрироваться</Link>
          </p>
        </div>
      </div>
    </div>
  );
}