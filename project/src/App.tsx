import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ChatPage from './components/ChatPage';
import PricingPage from './components/PricingPage';
import UserPage from './components/UserPage';
import ContactPage from './components/ContactPage';
import ProtectedRoute from './components/ProtectedRoute';
import DisclaimerPopup from './components/DisclaimerPopup';
import CookieConsentPopup from './components/CookieConsentPopup'; // Import the new component
import PrivacyPolicyPage from './components/PrivacyPolicyPage'; // Import the new component
import { ApiClient } from './utils/api';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(false);
  const [showCookieConsent, setShowCookieConsent] = useState<boolean>(false); // New state for cookie consent

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = ApiClient.isAuthenticated();
      setIsAuthenticated(loggedIn);
    };

    const hasAgreedToDisclaimer = localStorage.getItem('disclaimerAgreed');
    if (!hasAgreedToDisclaimer) {
      setShowDisclaimer(true);
    } else {
      // Only show cookie consent if disclaimer has been agreed to
      const hasAcceptedCookies = localStorage.getItem('cookiesAccepted');
      if (!hasAcceptedCookies) {
        setShowCookieConsent(true);
      }
    }

    checkAuth();
  }, []);

  const handleAgreeToDisclaimer = () => {
    localStorage.setItem('disclaimerAgreed', 'true');
    setShowDisclaimer(false);
    // After agreeing to disclaimer, check for cookie consent
    const hasAcceptedCookies = localStorage.getItem('cookiesAccepted');
    if (!hasAcceptedCookies) {
      setShowCookieConsent(true);
    }
  };

  const handleAcceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setShowCookieConsent(false);
  };

  const handleRejectCookies = () => {
    setShowCookieConsent(false);
  };

  // Avoid rendering until auth is known
  if (isAuthenticated === null) return null;

  return (
    <Router>
      {showDisclaimer && <DisclaimerPopup onAgree={handleAgreeToDisclaimer} />}
      {!showDisclaimer && showCookieConsent && <CookieConsentPopup onAccept={handleAcceptCookies} onReject={handleRejectCookies} />}
      <Routes>
        {/* Landing Page */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/chat" replace /> : <LandingPage />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/chat" replace /> : <LoginPage />}
        />

        {/* Register */}
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/chat" replace /> : <RegisterPage />}
        />

        {/* Pricing */}
        <Route
          path="/pricing"
          element={isAuthenticated ? <Navigate to="/chat" replace /> : <PricingPage />}
        />

        {/* Contact Page */}
        <Route
          path="/contact"
          element={isAuthenticated ? <Navigate to="/chat" replace /> : <ContactPage />}
        />

        {/* Chat (Protected Route) */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          }
        />

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/" replace />} />

        {/* Privacy Policy Page */}
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      </Routes>
    </Router>
  );
};

export default App;
