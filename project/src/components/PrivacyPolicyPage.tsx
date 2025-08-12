import React from 'react';
import { Link } from 'react-router-dom';
import { Scale } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/" className="flex items-center space-x-3" aria-label="Lex & Tech AI Home">
              <div className="p-2 bg-white rounded-xl shadow-lg">
                <Scale className="w-8 h-8 text-amber-700" />
              </div>
              <h1 className="text-3xl font-bold text-white">Lex & Tech AI</h1>
            </Link>
            <div className="flex space-x-4">
              <Link
                to="/pricing"
                className="px-6 py-3 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                Pricing
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 bg-white text-amber-700 font-semibold rounded-lg shadow-lg hover:bg-gray-50 transition-all duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 bg-black text-white font-semibold rounded-lg shadow-lg hover:bg-gray-900 transition-all duration-200"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Privacy Policy Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto bg-white rounded-lg shadow-lg my-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Privacy Policy</h1>
        <p className="text-gray-700 mb-4">
          Welcome to Lex & Tech AI. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our AI-based legal services at lexandtech ai (“lexandtech.pro”). Please read this privacy policy carefully. By accessing or using the Website, you agree to the terms of this Privacy Policy.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
        <p className="text-gray-700 mb-2">We collect various types of information in connection with the services we provide, including:</p>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">a. Personal Information</h3>
        <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
          <li><strong>Contact Details:</strong> Name, email address, phone number, and other contact information.</li>
          <li><strong>Account Information:</strong> If you create an account, we collect profile details and account preferences.</li>
        </ul>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">b. Non-Personal Information</h3>
        <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
          <li><strong>Device Information:</strong> IP address, browser type, operating system, and device type.</li>
          <li><strong>Usage Data:</strong> Pages viewed, time spent on the Website, search queries, and click patterns.</li>
          <li><strong>Cookies and Tracking Technologies:</strong> We use cookies, web beacons, and similar technologies to enhance your browsing experience.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
        <p className="text-gray-700 mb-2">We use your information to:</p>
        <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
          <li><strong>Provide and Improve Services:</strong> Deliver and personalize our legal AI services, respond to inquiries.</li>
          <li><strong>Communication:</strong> Send important updates, promotions, or newsletters if you opt-in for such communications.</li>
          <li><strong>Analytics and Improvements:</strong> Analyze user behavior and trends to improve our website, services, and user experience.</li>
          <li><strong>Legal Compliance:</strong> Comply with applicable laws, regulations, and legal obligations.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Sharing Your Information</h2>
        <p className="text-gray-700 mb-2">We do not sell or rent your personal information. However, we may share your data under the following circumstances:</p>
        <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
          <li><strong>Legal Compliance:</strong> If required by law or legal process, we may disclose your data to law enforcement agencies or regulatory authorities.</li>
          <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or asset sale, your data may be transferred to a new entity. You will be informed in  prior  in such circumstances.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Cookies and Tracking Technologies</h2>
        <p className="text-gray-700 mb-4">
          We use cookies and similar tracking technologies to collect data that helps us improve our services and provide you with a better user experience. You can control your cookie preferences through your browser settings. However, disabling cookies may affect the functionality of the Website. We have provided a Cookies Consent form.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Data Retention</h2>
        <p className="text-gray-700 mb-4">
          We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, or as required by law. Once your information is no longer necessary for our business purposes, we will securely delete or anonymize it.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Data Security</h2>
        <p className="text-gray-700 mb-4">
          We use industry-standard security measures to protect your information. However, no data transmission over the Internet is completely secure. While we strive to protect your personal data, we cannot guarantee its absolute security.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Your Rights</h2>
        <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
          <li><strong>Correction:</strong> You can request that we correct any inaccurate or incomplete data.</li>
          <li><strong>Data Portability:</strong> You can request a copy of your data in a machine-readable format.</li>
        </ul>
        <p className="text-gray-700 mb-4">
          To exercise any of these rights, please contact us at consult@lexandtech.pro
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Third-Party Links</h2>
        <p className="text-gray-700 mb-4">
          Our Website may contain links to third-party websites that are not operated by us. We are not responsible for the privacy practices of those sites. We encourage you to review the privacy policies of any third-party sites you visit.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Minor's Privacy</h2>
        <p className="text-gray-700 mb-4">
          Our services are not intended for children under the age of 18 and we do not knowingly collect information from children. If we learn that we have collected personal data from a child under 18, we will delete that information promptly. Use of this service by minors must be under the supervision and consent of a parent or&nbsp;legal&nbsp;guardian.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Changes to This Privacy Policy</h2>
        <p className="text-gray-700 mb-4">
          We reserve the right to update this Privacy Policy from time to time. When we make changes, we will revise the "Last Updated" date at the top of the page. We encourage you to periodically review this Privacy Policy to stay informed of our data practices.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Contact Us</h2>
        <p className="text-gray-700 mb-2">If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact us:</p>
        <p className="text-gray-700 mb-1"><strong>Lex & Tech AI</strong></p>
        <p className="text-gray-700 mb-1"><strong>Email:</strong> consult@lexandtech.pro</p>
        <p className="text-gray-700 mb-4"><strong>Address:</strong> Flex Coworks, 47, 2nd floor, 15th Cross Road, Dollar Layout, J. P. Nagar, 3rd Phase, Bengaluru - 560078</p>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto text-center px-4">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">Lex & Tech AI</span>
          </div>
          <p className="text-gray-400 mb-2">Empowering legal clarity through AI-powered assistance</p>
          <p className="text-gray-500 text-sm">© 2025 Lex & Tech AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicyPage;
