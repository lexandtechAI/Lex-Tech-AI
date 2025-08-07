import React from 'react';

interface CookieConsentPopupProps {
  onAccept: () => void;
  onReject: () => void; // New prop for rejecting cookies
}

const CookieConsentPopup: React.FC<CookieConsentPopupProps> = ({ onAccept, onReject }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 bg-opacity-95 text-white p-4 shadow-lg z-50">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm mb-3 md:mb-0 md:mr-4">
          We use cookies to ensure you get the best experience on our website. By continuing to use this site, you agree to our use of cookies.
        </p>
        <div className="flex space-x-2">
          <button
            onClick={onAccept}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex-shrink-0"
          >
            Accept Cookies
          </button>
          <button
            onClick={onReject}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex-shrink-0"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentPopup;
