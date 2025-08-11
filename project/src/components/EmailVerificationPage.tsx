import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const EmailVerificationPage: React.FC = () => {
  const [message, setMessage] = useState('Verifying your email...');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>(''); // 'success' or 'error'
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setMessage('Error: No verification token found in the URL.');
        setMessageType('error');
        return;
      }

      // IMPORTANT: Replace with your actual deployed backend URL
      // In production, get this from an environment variable
      const backendUrl = 'https://api.lexandtech.pro'; // e.g., https://your-fastapi-app.onrender.com
      const verifyEndpoint = `${backendUrl}/verify-email?token=${token}`;

      try {
        const response = await fetch(verifyEndpoint);
        const data = await response.json();

        if (response.ok) {
          setMessage(data.message || 'Email verified successfully!');
          setMessageType('success');
        } else {
          setMessage(data.detail || 'Verification failed. Please try again or contact support.');
          setMessageType('error');
        }
      } catch (error) {
        setMessage('An error occurred during verification. Please check your internet connection or try again later.');
        setMessageType('error');
        console.error('Verification fetch error:', error);
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div
      style={{
        fontFamily: 'sans-serif',
        textAlign: 'center',
        marginTop: '50px',
      }}
    >
      <h1>Email Verification</h1>
      <div
        className={`message ${messageType}`}
        style={{
          padding: '20px',
          borderRadius: '8px',
          margin: '20px auto',
          maxWidth: '500px',
          backgroundColor:
            messageType === 'success'
              ? '#d4edda'
              : messageType === 'error'
              ? '#f8d7da'
              : 'transparent',
          color:
            messageType === 'success'
              ? '#155724'
              : messageType === 'error'
              ? '#721c24'
              : 'inherit',
          border: messageType
            ? `1px solid ${
                messageType === 'success' ? '#c3e6cb' : '#f5c6cb'
              }`
            : 'none',
        }}
      >
        {message}
      </div>
    </div>
  );
};

export default EmailVerificationPage;
