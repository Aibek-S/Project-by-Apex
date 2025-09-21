import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { Helmet } from "react-helmet-async";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Load user profile from Supabase
  useEffect(() => {
    if (user) {
      loadProfile();
      setEmail(user.email);
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
  .select("full_name")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      if (data) {
        setFullName(data.full_name || "");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setError("Ошибка при загрузке профиля");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { error } = await supabase
        .from("users")
        .upsert({
          id: user.id,
          full_name: fullName,
          updated_at: new Date()
        });

      if (error) throw error;
      
      setMessage("Профиль успешно обновлен");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="auth-container">
        <div className="auth-form">
          <div style={{
            textAlign: 'center',
            padding: '20px'
          }}>
            Загрузка...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <Helmet>
        <title>Профиль - Apex Tourism</title>
      </Helmet>
      <div className="profile-card">
        <h2>Профиль</h2>
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        <div>
          <div className="profile-info">
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="profile-form-group">
                <label htmlFor="fullName" className="profile-form-label">Полное имя</label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Введите ваше имя"
                  className="profile-form-input"
                />
              </div>
              <div className="profile-form-group">
                <label htmlFor="email" className="profile-form-label">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Введите ваш email"
                  className="profile-form-input"
                  disabled
                />
                
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="profile-submit-button"
              >
                {loading ? "Сохранение..." : "Сохранить изменения"}
              </button>
            </form>
          </div>
        </div>
        <button 
          onClick={handleSignOut} 
          disabled={loading}
          className="signout-button"
        >
          {loading ? "Выход..." : "Выйти"}
        </button>
      </div>
    </div>
  );
}