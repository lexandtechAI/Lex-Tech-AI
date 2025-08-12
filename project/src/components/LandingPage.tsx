import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Shield, Users, BookOpen, ArrowRight, Gavel } from 'lucide-react';

// Reusable Feature Card
const FeatureCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <div className="p-10 bg-gradient-to-br from-amber-50 to-white rounded-2xl shadow-xl border border-amber-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
    <div className="p-4 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl w-fit mb-8">
      <Icon className="w-8 h-8 text-white" />
    </div>
    <h4 className="text-2xl font-bold text-gray-900 mb-6">{title}</h4>
    <p className="text-gray-600 leading-relaxed text-lg">{description}</p>
  </div>
);

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-xl shadow-lg">
                <Scale className="w-8 h-8 text-amber-700" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Lex & Tech AI</h1>
            </div>
            <div className="flex space-x-4">
              <Link to="/pricing" className="px-6 py-3 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-200">Pricing</Link>
              <Link to="/login" className="px-6 py-3 bg-white text-amber-700 font-semibold rounded-lg shadow-lg hover:bg-gray-50 transition-all duration-200">Login</Link>
              <Link to="/register" className="px-6 py-3 bg-black text-white font-semibold rounded-lg shadow-lg hover:bg-gray-900 transition-all duration-200">Sign Up</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
          Your AI-Powered Legal Assistant for
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-amber-600"> Indian Law</span>
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
          Navigate complex Indian legal frameworks with confidence. Lex & Tech AI provides expert guidance on Indian Law such as BNS, BNSS, BSA, DPDP, POCSO, and more, powered by advanced AI technology trusted by legal professionals.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/register" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold text-lg rounded-xl shadow-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-200 transform hover:scale-105">
            Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link to="/pricing" className="inline-flex items-center px-8 py-4 bg-white text-amber-700 font-semibold text-lg rounded-xl shadow-lg border-2 border-amber-200 hover:bg-amber-50 transition-all duration-200">
            View Pricing
          </Link>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-900 mb-20">
            Specialized Legal Domains
          </h3>
          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={Gavel} 
              title="Bharatiya Nyaya Sanhita (BNS)" 
              description="Get comprehensive guidance on the new criminal law framework that replaced the Indian Penal Code. Understand offenses, procedures, and legal implications with expert AI assistance." 
            />
            <FeatureCard 
              icon={Gavel} 
              title="Bharatiya Nagarik Suraksha Sanhita (BNSS)" 
              description="Detailed coverage of India's updated criminal procedure code, replacing the CrPC, with AI-powered explanations." 
            />
            <FeatureCard 
              icon={Shield} 
              title="Bharatiya Sakshya Adhiniyam (BSA)" 
              description="Understand India's updated evidence law, replacing the Indian Evidence Act, with clear AI-based insights." 
            />
            <FeatureCard 
              icon={Users} 
              title="Child Protection (POCSO)" 
              description="Understand the Protection of Children from Sexual Offences Act, including reporting mechanisms, legal procedures, and comprehensive support systems." 
            />
            <FeatureCard 
              icon={Shield} 
              title="Data Protection & Privacy (DPDP)" 
              description="Navigate India's Digital Personal Data Protection Act with expert insights on compliance, rights, and obligations for businesses and individuals in the digital age." 
            />
            <FeatureCard 
              icon={BookOpen} 
              title="Other Key Acts" 
              description="Information Technology Act, Arbitration and Conciliation Act, Limitation Act, Insolvency and Bankruptcy Act, Family Laws and many more..." 
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-900 mb-20">
            Why Choose Lex & Tech AI?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 text-center">
            <FeatureCard 
              icon={BookOpen} 
              title="Expert Knowledge Base" 
              description="Access comprehensive legal databases and the latest amendments in Indian law with real-time updates." 
            />
            <FeatureCard 
              icon={Scale} 
              title="Accurate Legal Guidance" 
              description="AI-powered responses based on verified legal sources, case precedents, and expert legal analysis." 
            />
            <FeatureCard 
              icon={Shield} 
              title="Secure & Confidential" 
              description="Your legal queries are handled with utmost privacy, security, and professional confidentiality." 
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500 text-center">
        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8">
          Ready to Get Legal Clarity?
        </h3>
        <p className="text-lg sm:text-xl text-amber-100 mb-12 leading-relaxed max-w-3xl mx-auto">
          Join thousands of legal professionals, students, and individuals who trust Lex & Tech AI for accurate, reliable legal guidance across all domains of Indian law.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/register" className="inline-flex items-center px-8 py-4 bg-white text-amber-700 font-semibold text-lg rounded-xl shadow-xl hover:bg-gray-50 transition-all duration-200 transform hover:scale-105">
            Start Your Free Trial <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link to="/pricing" className="inline-flex items-center px-8 py-4 bg-black text-white font-semibold text-lg rounded-xl shadow-xl hover:bg-gray-900 transition-all duration-200">
            View Pricing Plans
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="p-3 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl shadow-lg">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold">Lex & Tech AI</span>
          </div>
          <p className="text-gray-400 mb-6 text-lg">Empowering legal clarity through AI-powered assistance</p>
          <div className="flex justify-center space-x-6 sm:space-x-8 mb-8 text-sm sm:text-base">
            <Link to="/pricing" className="text-gray-400 hover:text-white">Pricing</Link>
            <Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link>
            <Link to="/login" className="text-gray-400 hover:text-white">Login</Link>
            <Link to="/register" className="text-gray-400 hover:text-white">Sign Up</Link>
            <Link to="/privacy-policy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
          </div>
          <p className="text-gray-500 text-sm">© 2025 Lex & Tech AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
