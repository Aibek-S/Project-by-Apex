import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
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
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      if (data) {
        setFullName(data.full_name || "");
        setAvatarUrl(data.avatar_url || "");
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
          avatar_url: avatarUrl,
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

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      // In a real app, you would upload to Supabase storage
      // For now, we'll just simulate the process
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
        setMessage("Аватар успешно загружен");
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setError("Ошибка при загрузке аватара: " + error.message);
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
      <div className="profile-card">
        <h2>👤 Профиль</h2>
        
        {error && <div className="error-message">❌ {error}</div>}
        {message && <div className="success-message">✅ {message}</div>}

        <div>
          <div className="profile-info">
            {/* Avatar Upload */}
            <div className="profile-avatar-container">
              <div className="profile-avatar-wrapper">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt="Avatar" 
                    className="profile-avatar"
                  />
                ) : (
                  <div className="profile-avatar-placeholder">
                    👤
                  </div>
                )}
                <label 
                  htmlFor="avatarUpload" 
                  className="profile-avatar-upload"
                >
                  ✏️
                </label>
              </div>
              <label 
                htmlFor="avatarUpload" 
                className="profile-avatar-label"
              >
                Загрузить фото
              </label>
              <input 
                id="avatarUpload"
                type="file" 
                accept="image/*" 
                onChange={handleAvatarUpload}
                style={{ display: 'none' }}
              />
              <p className="profile-avatar-note">
                JPG, GIF или PNG. Макс. размер 5MB.
              </p>
            </div>

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
                <p className="profile-avatar-note" style={{ marginTop: '5px' }}>
                  Email можно изменить в настройках безопасности
                </p>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="profile-submit-button"
              >
                {loading ? "Сохранение..." : "💾 Сохранить изменения"}
              </button>
            </form>
          </div>
        </div>

        {/* Sign Out Button */}
        <button 
          onClick={handleSignOut} 
          disabled={loading}
          className="signout-button"
        >
          {loading ? "Выход..." : "🚪 Выйти"}
        </button>
      </div>
    </div>
  );
}