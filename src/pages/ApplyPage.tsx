import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";

const ApplyPage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-pattern" />
        <div className="hero-content">
          <div className="hero-logo">
            <img src={logo} alt="Ahlussuffa Logo" />
          </div>
          <h1 className="hero-title">Ahlussuffa Dars</h1>
          <p className="hero-tagline">Where Faith Meets Knowledge</p>
          <p className="hero-location">Kannur, Kerala</p>
          <div className="hero-badge">
            <span className="pulse-dot" />
            Admissions Open 2026–27
          </div>
        </div>
        <div className="hero-scroll-hint">
          <span>Scroll to explore</span>
          <div className="scroll-arrow">↓</div>
        </div>
      </section>

      {/* Admission Options Section */}
      <section className="admission-options">
        <div className="section-container">
          <div className="section-header">
            <span className="section-label">Get Started</span>
            <h2 className="section-title">Choose Your Path</h2>
            <p className="section-desc">
              Select the admission type that best describes your situation
            </p>
          </div>

          <div className="admission-cards">
            {/* New Admission Card */}
            <Link to="/apply/new" className="admission-card admission-card--new">
              <div className="card-glow" />
              <div className="card-icon card-icon--new">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 14l9-5-9-5-9 5 9 5z"/>
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                  <path d="M12 14l9-5-9-5-9 5 9 5z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="card-content">
                <h3 className="card-title">New Admission</h3>
                <p className="card-desc">
                  For first-time applicants joining Ahlussuffa Dars. Complete our comprehensive application form to begin your journey.
                </p>
                <ul className="card-features">
                  <li>Full application process</li>
                  <li>All classes available</li>
                  <li>Document upload required</li>
                </ul>
              </div>
              <div className="card-action">
                <span>Apply Now</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </Link>

            {/* Local Admission Card */}
            <Link to="/apply/local" className="admission-card admission-card--local">
              <div className="card-glow" />
              <div className="card-icon card-icon--local">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
              </div>
              <div className="card-content">
                <h3 className="card-title">Local / Re-admission</h3>
                <p className="card-desc">
                  For existing students continuing their studies. Quick re-enrollment with simplified form fields.
                </p>
                <ul className="card-features">
                  <li>Fast-track process</li>
                  <li>Pre-filled information</li>
                  <li>Priority enrollment</li>
                </ul>
              </div>
              <div className="card-action">
                <span>Re-enroll Now</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Locate Application Section */}
      <section className="locate-section">
        <div className="section-container">
          <div className="locate-box">
            <div className="locate-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
                <path d="M11 8v6M8 11h6" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="locate-content">
              <h3 className="locate-title">Already Applied?</h3>
              <p className="locate-desc">
                Find your existing application using your mobile number and date of birth. 
                View, print, or download your application form anytime.
              </p>
              <Link to="/locate" className="locate-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
                <span>Find My Application</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="info-section">
        <div className="section-container">
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">📞</div>
              <h4>Need Help?</h4>
              <p>Contact our admissions office for assistance with your application.</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📅</div>
              <h4>Important Dates</h4>
              <p>Application deadline: March 31, 2026</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📋</div>
              <h4>Requirements</h4>
              <p>Keep your documents ready: Photo, ID proof, Previous marksheets</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <p>© 2026 Ahlussuffa Dars. All rights reserved.</p>
          <p className="footer-tagline">Where Faith Meets Knowledge</p>
        </div>
      </footer>
    </div>
  );
};

export default ApplyPage;
