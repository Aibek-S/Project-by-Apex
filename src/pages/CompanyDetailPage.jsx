import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useCompany } from "../hooks/useSupabase";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import ImageLoader from "../components/ImageLoader";

export default function CompanyDetailPage() {
  const { companyName } = useParams();
  const { t } = useLanguage();
  const { companyData, loading, error } = useCompany(decodeURIComponent(companyName));

  if (loading) {
    return (
      <div className="loading-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <p className="muted">{t("loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        gap: 16
      }}>
        <p className="muted" style={{ color: 'var(--primary)' }}>
          {t("error")}: {error}
        </p>
        <Link className="btn" to="/tours">
          {t("back")}
        </Link>
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="no-data-container" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        gap: 16
      }}>
        <p className="muted">{t("noData")}</p>
        <Link className="btn" to="/tours">
          {t("back")}
        </Link>
      </div>
    );
  }

  // Get services based on current language
  let services = [];
  if (t("companyServices") && Array.isArray(t("companyServices"))) {
    services = t("companyServices");
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <Helmet>
        <title>
          {companyData.name} - {t("company")}
        </title>
      </Helmet>
      
      <div style={{ marginBottom: 24 }}>
        <Link to="/tours" className="btn" style={{ marginBottom: 16, display: 'inline-block' }}>
          ← {t("back")}
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
          padding: '20px',
          backgroundColor: 'var(--card)',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <h1 style={{ margin: 0, color: 'var(--primary)' }}>
              {companyData.name}
            </h1>
            {/* Logo display next to company name - implemented exactly like in TourDetailPage */}
            {companyData.logoUrl ? (
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <ImageLoader
                  src={companyData.logoUrl}
                  alt={`${companyData.name} logo`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            ) : (
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '32px',
                color: '#1a120b'
              }}>
                {companyData.name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr', 
          gap: 24,
          marginBottom: 40
        }}>
          <div style={{ 
            backgroundColor: 'var(--card)',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid var(--border)'
          }}>
            <h2 style={{ marginTop: 0, color: 'var(--primary)' }}>{t("about")}</h2>
            <p style={{ lineHeight: 1.6, fontSize: "1.1em" }}>
              {t("companyAbout")}
            </p>
          </div>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 24
          }}>
            <div style={{ 
              backgroundColor: 'var(--card)',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid var(--border)'
            }}>
              <h3 style={{ marginTop: 0, color: 'var(--primary)' }}>{t("ourMission")}</h3>
              <p style={{ lineHeight: 1.6 }}>
                {t("companyFounded")}
              </p>
            </div>

            <div style={{ 
              backgroundColor: 'var(--card)',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid var(--border)'
            }}>
              <h3 style={{ marginTop: 0, color: 'var(--primary)' }}>{t("services")}</h3>
              <ul style={{ 
                paddingLeft: '20px', 
                lineHeight: 1.6,
                margin: '10px 0'
              }}>
                {services.map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ 
            backgroundColor: 'var(--card)',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid var(--border)'
          }}>
            <h2 style={{ marginTop: 0, color: 'var(--primary)' }}>{t("contact")}</h2>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 24
            }}>
              <div>
                <p style={{ margin: '8px 0' }}>
                  <strong>{t("phone")}:</strong> +7 (777) 456-78-90
                </p>
                <p style={{ margin: '8px 0' }}>
                  <strong>Email:</strong> info@mangystautour.kz
                </p>
              </div>
              <div>
                <p style={{ margin: '8px 0' }}>
                  <strong>{t("address")}:</strong> {t("companyAddress")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}