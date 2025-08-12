import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Shield, Users, BookOpen, ArrowRight, Gavel, Star, CheckCircle } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300">
    <Icon className="h-12 w-12 text-amber-500 mb-4" />
    <h4 className="text-xl font-semibold mb-2">{title}</h4>
    <p className="text-gray-600">{description}</p>
  </div>
);

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/" className="text-2xl font-bold flex items-center space-x-2">
              <Scale className="h-8 w-8" />
              <span>Lex & Tech AI</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link to="/features" className="hover:text-gray-100">Features</Link>
              <Link to="/about" className="hover:text-gray-100">About</Link>
              <Link to="/contact" className="hover:text-gray-100">Contact</Link>
            </nav>
            <Link
              to="/get-started"
              className="ml-4 inline-flex items-center px-4 py-2 bg-white text-amber-600 rounded-lg shadow hover:bg-gray-100"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Your AI-Powered Legal Research Assistant
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Access instant, accurate, and up-to-date insights into Indian laws and regulations.
            From criminal codes to data protection, Lex & Tech AI simplifies your legal research.
          </p>
          <Link
            to="/get-started"
            className="inline-flex items-center px-6 py-3 bg-amber-500 text-white rounded-lg shadow hover:bg-amber-600"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Specialized Legal Domains */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-900 mb-20">
            Specialized Legal Domains
          </h3>
          <div className="grid md:grid-cols-3 gap-10">
            {/* Top Row */}
            <FeatureCard
              icon={Gavel}
              title="Bharatiya Nyaya Sanhita (BNS)"
              description="Comprehensive guidance on India's new criminal law replacing the IPC, including offenses, procedures, and implications."
            />
            <FeatureCard
              icon={Gavel}
              title="Bharatiya Nagarik Suraksha Sanhita (BNSS)"
              description="Detailed coverage of India's updated criminal procedure code, replacing the CrPC, with AI-powered explanations."
            />
            <FeatureCard
              icon={Gavel}
              title="Bharatiya Sakshya Adhiniyam (BSA)"
              description="Understand India's updated evidence law, replacing the Indian Evidence Act, with clear AI-based insights."
            />

            {/* Bottom Row */}
            <FeatureCard
              icon={Shield}
              title="Child Protection (POCSO)"
              description="In-depth guidance on the Protection of Children from Sexual Offences Act, reporting, and legal processes."
            />
            <FeatureCard
              icon={Shield}
              title="Data Protection & Privacy (DPDP)"
              description="Navigate the Digital Personal Data Protection Act with expert compliance advice for individuals and businesses."
            />
            <FeatureCard
              icon={BookOpen}
              title="Other Key Acts"
              description="Information Technology Act, Arbitration and Conciliation Act, Limitation Act, Insolvency and Bankruptcy Act, and many more..."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-500 to-yellow-400 text-center text-white">
        <h3 className="text-3xl sm:text-4xl font-bold mb-6">
          Ready to Revolutionize Your Legal Research?
        </h3>
        <p className="max-w-2xl mx-auto mb-8 text-lg">
          Join thousands of legal professionals, students, and businesses already using Lex & Tech AI.
        </p>
        <Link
          to="/get-started"
          className="inline-flex items-center px-6 py-3 bg-white text-amber-600 rounded-lg shadow hover:bg-gray-100"
        >
          Get Started
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} Lex & Tech AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
